<template>
  <div class="im-view" :ref="refsName" :style="imViewStyle">
    <MsgHeader
      v-bind="$props"
      v-on="$listeners"
      :groupRole="myGroupRole"
      :groupRoleManager="groupRoleManager"
    >
      <template slot="rightBtn">
        <slot name="header"></slot>
      </template>
    </MsgHeader>

    <div class="message-panel" ref="messagePanel" @scroll="handleScroll">
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
          <span @click="(event) => handleFriend(item, event)">
            <MsgLazyUserInfo
              :class="
                checkSelf(item) &&
                bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN
                  ? 'self'
                  : 'target'
              "
              :is-self="checkSelf(item)"
              :session="session"
              :message="item"
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
            />
            <div
              class="send-tips"
              :class="
                checkSelf(item) &&
                bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN
                  ? 'self'
                  : 'target'
              "
              v-if="item.sendState !== 1"
            >
              <img
                class="loading-icon"
                v-if="item.sendState === 0"
                :src="LsAssets.loadingIcon"
                alt=""
              />
              <span
                class="send-error"
                v-if="item.sendState === -1"
                @click="handleResendMsg"
              >
                <LsIcon
                  render-svg
                  width="17"
                  height="17"
                  icon="a-zt_ts_icon2x"
                ></LsIcon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MsgInputAction
      v-bind="$props"
      :groupRole="myGroupRole"
      :groupRoleManager="groupRoleManager"
      @refreshMsg="handleRefreshMsg"
      @pushMsg="handlePushLocalMsg"
    />

    <!--    <div class='notify'>-->
    <!--      <LsIcon render-svg width='16' height='16' icon='a-icon_qungonggao2x'></LsIcon>-->
    <!--      <span class='label'>群公告:</span>-->
    <!--      <span class='content'>-->
    <!--        <span>啊实打实大师大大撒上的啊实打实大师大大撒上的啊实打实大师大大撒上的啊</span>-->
    <!--      </span>-->
    <!--    </div>-->

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="friendPanelConfig"
        @update="handleCloseDialog"
        @sendApply="handleSendApply"
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

import {
  IMGetGroupRoleManagerList,
  IMGetMessageList,
  IMGetMyGroupMemberInfo,
  IMGetOneFriend,
  IMGetUserProfile,
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
    isFocus: {
      type: Boolean,
      default: true,
    },
    isSmallEditor: {
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
          minWidth: '399px',
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
          this.getMessageList();
          this.setCurrentMsg({});
        }
      },
    },
    refreshMsg(val) {
      if (val) {
        this.getMessageList();
      }
    },
    refreshGroupRoleManager() {
      this.getGroupRoleManagerList();
      this.getMyGroupMemberInfo();
    },
    groupUserAttributeChanged(data) {
      const { groupId, nickname, userId, avatar } = data;
      if (this.session.toUser === groupId) {
        this.messageList = this.messageList.map((d) => {
          if (d.fromUser === userId) {
            d.fromNickname = nickname;
            d.fromAvatar = avatar;
          }
          return {
            ...d,
          };
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
      this.messageList = this.messageList.map((d) => {
        if (d.fromUser === userId) {
          d.fromNickname = nickname;
          d.fromAvatar = avatar;
        }
        return {
          ...d,
        };
      });
    },
  },
  computed: {
    ...mapGetters('IMStore', [
      'userInfo',
      'currentMsg',
      'refreshMsg',
      'refreshGroupRoleManager',
      'userNicknameAvatarUpdate',
      'groupUserAttributeChanged',
      'groupMemberDeleteCallBack',
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
    this.bubbleModel =
      (await renderProcess.getStore('SESSION_BUBBLE_MODEL')) ||
      SESSION_BUBBLE_MODEL.IS_BETWEEN;
    this.throttleGetMessageList = lodash.throttle(this.getMessageList, 200, {
      leading: true,
      trailing: false,
    });

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
    ...mapActions('IMStore', ['setDragFileList', 'setCurrentMsg']),

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
      // 拉取SDK缓存消息，每次sdk最多返回20条消息
      IMGetMessageList(sessId, this.nextSeq).then((res) => {
        const { msgs, nextSeq, hasNext } = res?.data || {};
        this.hasNext = hasNext;
        this.nextSeq = nextSeq;
        if (isContinue && this.messageList?.length) {
          this.messageList.unshift(...msgs);
          setTimeout(() => {
            const currentScrollHeight = this.$refs.messagePanel?.scrollHeight;
            this.$refs.messagePanel.scrollTop =
              currentScrollHeight - this.preScrollHeight + this.scrollTop;
          }, 1);
        } else {
          this.messageList = msgs;
          setTimeout(() => {
            this.$refs.messagePanel.scrollTop =
              this.$refs.messagePanel?.scrollHeight;
          }, 1);
        }
      });
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
      const isSelf = this.checkSelf(item);
      if (isSelf) return;

      await this.openFriendDialog(event, async () => {
        const { fromUser } = item;
        const friendInfo = (await IMGetOneFriend(fromUser))?.data || {};
        if (friendInfo?.userId) {
          this.friendPanelConfig = this.isGroup
            ? { isPass: true }
            : { isDetails: true };
        } else {
          this.friendPanelConfig = { isApply: true };
        }

        const userProfile = (await IMGetUserProfile(fromUser))?.data || {};
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
        this.$refs.messagePanel.scrollTop =
          this.$refs.messagePanel?.scrollHeight;
      });
    },
    handleRefreshMsg() {
      this.getMessageList();
    },

    handleResendMsg() {
      // TODO
      console.log('重发');
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

          .send-tips {
            position: absolute;
            bottom: 0;

            &.self {
              left: -25px;
            }

            &.target {
              right: -25px;
            }

            .loading-icon {
              display: block;
              width: 17px;
              height: 17px;
              transform-origin: center;
              animation: 2s loadLoop linear infinite normal;
            }

            @keyframes loadLoop {
              0% {
                transform: rotateZ(0deg);
              }
              100% {
                transform: rotateZ(360deg);
              }
            }

            .send-error {
              display: flex;
              cursor: pointer;
            }
          }
        }
      }

      &:last-child {
        margin-bottom: 20px;
      }
    }
  }

  .notify {
    position: absolute;
    left: 0;
    top: 66px;
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 0 20px;
    background-color: $bg-grey-color;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    color: $main-text-color;

    .label {
      font-weight: bold;
      padding: 0 6px;
    }

    .content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      span {
        display: inline-block;
        animation: 10s wordsLoop linear infinite normal;
      }

      @keyframes wordsLoop {
        0%,
        20% {
          transform: translateX(0px);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    }
  }
}
</style>
