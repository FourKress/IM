<template>
  <div class="im-view" :ref="refsName" :style="imViewStyle">
    <MsgHeader
      v-bind="$props"
      v-on="$listeners"
      :groupRole="myGroupRole"
      :groupRoleManager="groupRoleManager"
      :memberCount="memberCount"
      @checkMember="handleFriend"
    >
      <template slot="rightBtn">
        <slot name="header"></slot>
      </template>
    </MsgHeader>

    <div
      class="message-panel"
      ref="messagePanel"
      :style="{ opacity: loadComplete ? '1' : '0' }"
      @scroll="handleScroll"
    >
      <div
        class="message-item"
        v-for="(item, index) in messageList"
        :key="`${index}_${item.msgId}`"
      >
        <div
          class="tips-row"
          :style="{
            marginTop:
              !checkTimesInterval(
                item.timestamp,
                messageList[Math.max(index - 1, 0)].timestamp,
              ) && !BASE_MSG_TYPES.includes(item.msgType)
                ? '8px'
                : '0',
          }"
        >
          <TimesTransform
            v-if="
              checkTimesInterval(
                item.timestamp,
                messageList[Math.max(index - 1, 0)].timestamp,
              )
            "
            :timestamp="item.timestamp"
          />
          <span class="tips-tag" v-if="!BASE_MSG_TYPES.includes(item.msgType)">
            {{ MSG_FORMAT_MAP[item.msgType]?.label(item.data) }}
          </span>
        </div>

        <div
          v-if="BASE_MSG_TYPES.includes(item.msgType)"
          class="msg-row"
          :class="
            checkSelf(item) && bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN
              ? 'self'
              : 'target'
          "
          :style="{ minHeight: !checkSelf(item) && isGroup ? '68px' : '50px' }"
        >
          <span
            @click="(event) => handleFriend({ userId: item.fromUser }, event)"
          >
            <MsgLazyUserInfo
              :isSelf="checkSelf(item)"
              :bubbleModel="bubbleModel"
              :session="session"
              :rawMsg="item"
            />
          </span>

          <div
            class="info"
            :style="{ marginTop: !checkSelf(item) && isGroup ? '18px' : 0 }"
          >
            <MsgCard
              :isSelf="checkSelf(item)"
              :imViewWidth="imViewWidth"
              :bubbleModel="bubbleModel"
              :rawMsg="item"
              :session="session"
              @checkAtUser="handleFriend"
            />
            <MsgSendTips
              :isSelf="checkSelf(item)"
              :bubbleModel="bubbleModel"
              :rawMsg="item"
              :session="session"
              :memberCount="memberCount"
              @checkMember="handleFriend"
            />
          </div>
        </div>
      </div>
    </div>

    <MsgInputAction
      v-bind="$props"
      :memberCount="memberCount"
      :groupRole="myGroupRole"
      :groupRoleManager="groupRoleManager"
      @pushMsg="handlePushLocalMsg"
      @checkAtUser="handleFriend"
    />

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="friendPanelConfig"
        @update="handleCloseDialog"
        @sendApply="handleSendApply"
        @sendMsg="handleSendMsg"
        @sendVideo="handleSendVideo"
        @sendAudio="handleSendAudio"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  lodash,
  checkTimesInterval,
  BASE_MSG_TYPES,
  MSG_FORMAT_MAP,
  FriendMixins,
  SESSION_BUBBLE_MODEL,
  SESSION_USER_TYPE,
  GROUP_ROLE_TYPE_LOCAL,
} from '@lanshu/utils';
import {
  LsIcon,
  LsAssets,
  LsCardDialog,
  LsFriendPanel,
  TimesTransform,
} from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';
import MsgCard from './msg-view/msg-card';
import MsgHeader from './msg-view/msg-header';
import MsgInputAction from './msg-view/msg-input-action';
import MsgLazyUserInfo from './msg-view/msg-lazy-userinfo.vue';
import MsgSendTips from './msg-view/msg-send-tips.vue';

import {
  IMGetGroupRoleManagerList,
  IMGetMessageList,
  IMGetMyGroupMemberInfo,
  IMGetOneFriend,
  IMGetUserProfile,
  IMReceiptMessage,
  IMGetGroupCurrentMemberCount,
} from '../IM-SDK';

export default {
  name: 'ImView',
  components: {
    TimesTransform,
    MsgCard,
    MsgHeader,
    MsgInputAction,
    MsgLazyUserInfo,
    LsIcon,
    LsCardDialog,
    LsFriendPanel,
    MsgSendTips,
  },
  mixins: [FriendMixins],
  props: {
    session: {
      type: Object,
      default: () => {},
      require: true,
    },
    recordrtc: {
      type: Object,
      default: () => {},
      require: true,
    },
    isSynergy: {
      type: Boolean,
      default: false,
    },
    headerStyle: {
      type: Object,
      default: () => {},
    },
    imViewStyle: {
      type: Object,
      default: () => {
        return {
          minWidth: '398px',
        };
      },
    },
  },
  data() {
    return {
      SESSION_BUBBLE_MODEL,
      BASE_MSG_TYPES,
      MSG_FORMAT_MAP,
      LsAssets,
      messageList: [],
      hasNext: true,
      nextSeq: 0,
      throttleGetMessageList: null,

      scrollTop: 0,
      preScrollHeight: 0,
      accept: '',
      friendPanelConfig: {},
      showFriendDialog: false,
      bubbleModel: '',
      myGroupRole: GROUP_ROLE_TYPE_LOCAL.IS_DEFAULT,
      groupRoleManager: {},
      imViewWidth: 500,
      resizeObserver: null,
      memberCount: 0,
      loadComplete: false,
    };
  },
  watch: {
    session: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (val?.sessId === oldVal?.sessId) return;
        // TODO 临时处理手动创建会话时 mainSessionWindow 的更新问题
        if (val && (val?.nickname || val?.sessId)) {
          this.initData();
        }
      },
    },
    currentMsg: {
      immediate: true,
      deep: true,
      async handler(msg) {
        if (!this?.session?.sessId) return;
        if (msg?.sessId === this?.session?.sessId) {
          this.handlePushLocalMsg(msg);
          this.setCurrentMsg({});
        }
      },
    },
    refreshMsg(val) {
      if (val) {
        this.getMessageList();
      }
    },
    updateMsg: {
      immediate: true,
      deep: true,
      async handler(msg) {
        if (!this?.session?.sessId) return;
        if (msg?.sessId === this?.session?.sessId) {
          this.handleUpdateMsg(msg);
          this.setUpdateMsg({});
        }
      },
    },
    refreshGroupRoleManager() {
      this.getGroupRoleManagerList();
      this.getMyGroupMemberInfo();
    },
    groupUserAttributeChanged(data) {
      const { groupId, nickname, userId, avatar } = data;
      if (this.session.toUser === groupId) {
        this.handleModifyMsgList({
          nickname,
          userId,
          avatar,
        });
      }
    },
    groupMemberDeleteCallBack(data) {
      const { groupId } = data;
      if (groupId === this.session.toUser) {
        this.getMyGroupMemberInfo();
      }
    },

    userNicknameAvatarUpdate(data) {
      const { nickname, userId, avatar } = data;
      this.handleModifyMsgList({
        nickname,
        userId,
        avatar,
      });
    },

    refreshMembers() {
      this.getGroupCurrentMemberCount();
    },
  },
  computed: {
    ...mapGetters('IMStore', [
      'userInfo',
      'currentMsg',
      'refreshMsg',
      'updateMsg',
      'refreshGroupRoleManager',
      'userNicknameAvatarUpdate',
      'groupUserAttributeChanged',
      'groupMemberDeleteCallBack',
      'refreshMembers',
    ]),
    toAvatar() {
      return this.session.avatar;
    },
    isGroup() {
      return this.session.toUserType === SESSION_USER_TYPE.IS_GROUP;
    },
    refsName() {
      return `ImView_${this.session.sessId}`;
    },
  },
  async mounted() {
    this.getGroupCurrentMemberCount();
    this.bubbleModel =
      (await renderProcess.getStore('SESSION_BUBBLE_MODEL')) ||
      SESSION_BUBBLE_MODEL.IS_BETWEEN;
    this.throttleGetMessageList = lodash.throttle(this.getMessageList, 200, {
      leading: true,
      trailing: false,
    });

    setTimeout(() => {
      this.loadComplete = true;
    }, 1);

    const imViewDom = this.$refs[this.refsName];
    //添加拖拽事件监听器
    imViewDom.addEventListener('drop', (e) => {
      //阻止默认行为
      e.preventDefault();
      //获取文件列表
      const files = e.dataTransfer.files;

      if (files?.length > 0) {
        //获取文件路径
        const path = files[0].path;
        // 禁止发言
        if (
          this.isGroup &&
          this.groupRoleManager.whoCanSendMessage > this.myGroupRole
        ) {
          this.$message.warning('暂无权限！');
          return;
        }
        this.setDragFileList({
          sessId: this.session.sessId,
          files,
        });
      }
    });

    //阻止拖拽结束事件默认行为
    imViewDom.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        this.imViewWidth = cr.width;
      }
    });
    this.resizeObserver = resizeObserver;
    // 观察一个或多个元素
    this.resizeObserver.observe(this.$refs[this.refsName]);
  },
  methods: {
    ...mapActions('IMStore', [
      'setDragFileList',
      'setCurrentMsg',
      'setUpdateMsg',
    ]),

    checkTimesInterval,
    initData() {
      this.messageList = [];
      this.nextSeq = 0;
      this.hasNext = true;
      if (this.isGroup) {
        this.getMyGroupMemberInfo();
        this.getGroupRoleManagerList();
      }
      this.getMessageList();
    },
    checkSelf(item) {
      return !item.fromUser || item.fromUser === this.userInfo.userId;
    },

    getMessageList(isContinue = false) {
      const sessId = this.session?.sessId;
      if (!sessId) return;
      if (!isContinue) {
        this.nextSeq = 0;
      }
      // 拉取SDK缓存消息，每次sdk最多返回50条消息
      IMGetMessageList(sessId, this.nextSeq).then((res) => {
        const { msgs, nextSeq, hasNext } = res?.data || {};
        this.hasNext = hasNext;
        this.nextSeq = nextSeq;
        if (isContinue && this.messageList?.length) {
          this.messageList.unshift(...msgs);
          setTimeout(() => {
            const currentScrollHeight = this.$refs.messagePanel?.scrollHeight;
            if (this.$refs.messagePanel) {
              this.$refs.messagePanel.scrollTop =
                currentScrollHeight - this.preScrollHeight + this.scrollTop;
            }
            this.handleCheckMsgReceipt();
          }, 10);
        } else {
          this.messageList = msgs;
          setTimeout(() => {
            if (this.$refs.messagePanel) {
              this.$refs.messagePanel.scrollTop =
                this.$refs.messagePanel?.scrollHeight;
            }
            this.handleCheckMsgReceipt();
          }, 10);
        }
      });
    },

    handleCheckMsgReceipt() {
      setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries, observer) => {
            const receiptMsgIds = [];
            entries.forEach((entry) => {
              const { isIntersecting, target } = entry;
              // 进入可视区，判断是否需要进行已读
              if (isIntersecting) {
                const msgId = target.getAttribute('data-msg-id');
                const msg = this.messageList.find((d) => d.msgId === msgId);
                if (!msg) return;
                const notSelf = !this.checkSelf({ fromUser: msg.fromUser });
                if (msg.needReadReceipt && notSelf) {
                  this.messageList = this.messageList.map((m) => {
                    return {
                      ...m,
                      needReadReceipt:
                        msgId === m.msgId ? 0 : m.needReadReceipt,
                    };
                  });
                  receiptMsgIds.push(msgId);
                  observer.unobserve(target);
                }
              }
            });
            if (receiptMsgIds.length) {
              IMReceiptMessage([...new Set([...receiptMsgIds])]);
            }
          },
          {
            threshold: 0.8,
            root: this.$refs.messagePanel,
          },
        );
        const msgCardList = document.querySelectorAll('.msg-card-item');
        msgCardList.forEach((element, index) => {
          observer.observe(element);
        });
      }, 10);
    },

    handleScroll: lodash.throttle(
      function (event) {
        if (!this.hasNext) return;
        const scrollTop = event.target.scrollTop;
        if (
          scrollTop <= 500 &&
          (scrollTop <= this.scrollTop || this.scrollTop === 0)
        ) {
          this.preScrollHeight = this.$refs.messagePanel?.scrollHeight;
          this.scrollTop = scrollTop;
          this.throttleGetMessageList(true);
        }
      },
      200,
      {
        leading: true,
        trailing: false,
      },
    ),

    async handleFriend(item, event) {
      await this.openFriendDialog(event, async () => {
        const { userId } = item;
        const friendInfo = (await IMGetOneFriend(userId))?.data || {};
        if (friendInfo?.userId) {
          this.friendPanelConfig = this.isGroup
            ? { isPass: true }
            : { isDetails: true };
        } else {
          this.friendPanelConfig = { isApply: true };
        }

        const userProfile = (await IMGetUserProfile(userId))?.data || {};
        const { remark, desc } = friendInfo;
        return {
          ...userProfile,
          remark,
          desc,
        };
      });

      if (this.friendInfo?.dep) {
        this.friendPanelConfig = { isPass: true };
      }
    },

    handlePushLocalMsg(msg) {
      this.messageList.push(msg);
      this.$nextTick(() => {
        if (this.$refs.messagePanel) {
          this.$refs.messagePanel.scrollTop =
            this.$refs.messagePanel?.scrollHeight;
        }
      });
    },

    handleUpdateMsg(msg) {
      this.messageList = this.messageList.map((d) => {
        if (d.cliMsgId === msg.cliMsgId) {
          return {
            ...d,
            ...msg,
          };
        }
        return {
          ...d,
        };
      });
    },

    handleRefreshMsg() {
      this.getMessageList();
    },

    handleModifyMsgList(msg) {
      const { userId, ...other } = msg;
      this.messageList = this.messageList.map((d) => {
        if (d.fromUser === msg.userId) {
          return {
            ...d,
            ...other,
          };
        }
        return {
          ...d,
        };
      });
    },

    getGroupRoleManagerList() {
      IMGetGroupRoleManagerList(this.session.toUser)
        .then((res) => {
          this.groupRoleManager = res?.data || {};
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getMyGroupMemberInfo() {
      const res = await IMGetMyGroupMemberInfo(this.session.toUser);
      const { role } = res?.data || {};
      this.myGroupRole = role || GROUP_ROLE_TYPE_LOCAL.IS_NOT_AUTH;
    },

    getGroupCurrentMemberCount() {
      if (!this.isGroup) {
        this.memberCount = 2;
        return;
      }
      IMGetGroupCurrentMemberCount(this.session.toUser).then((res) => {
        const { memberCount = 0 } = res;
        this.memberCount = memberCount;
      });
    },
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.observe(this.$refs[this.refsName]);
    }
  },
};
</script>

<style scoped lang="scss">
.im-view {
  height: 100%;
  background-color: $bg-IM-color;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  position: relative;

  .message-panel {
    flex: 1;
    padding: 0 20px;
    overflow-y: auto;
    overflow-x: hidden;
    transform: translate3d(0, 0, 0);
    opacity: 0;

    .message-item {
      .tips-row {
        min-height: 26px;
        width: 100%;
        font-size: 12px;
        text-align: center;
        color: $tips-text-color;
        line-height: 26px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background-color: transparent;

        .tips-tag {
          background: $split-line-color;
          padding: 0 18px;
          border-radius: 13px;
        }
      }

      &:first-child {
        margin-top: 20px;
      }

      .msg-row {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        transform: translate3d(0, 0, 0);
        position: relative;

        &.self {
          padding-left: 60px;
          flex-flow: row-reverse;
        }

        &.target {
          padding-right: 60px;
        }

        .info {
          min-height: 50px;
          max-width: 80%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          font-size: 14px;
          color: $main-text-color;
          line-height: 20px;
        }
      }

      &:last-child {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
