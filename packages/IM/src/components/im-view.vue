<template>
  <div class="im-view">
    <MsgHeader
      v-bind="$props"
      v-on="$listeners"
      :groupRole="myGroupRole"
      :groupRoleManager="groupRoleManager"
    />

    <div class="message-panel" ref="messagePanel" @scroll="handleScroll">
      <div
        class="message-item"
        v-for="(item, index) in messageList"
        :key="`${index}_${item.msgId}`"
      >
        <div class="tips-row" :style="{marginTop: !checkTimesInterval(
                item.timestamp,
                messageList[Math.max(index - 1, 0)].timestamp,
              ) && !BASE_MSG_TYPES.includes(item.msgType) ? '8px' : '0' }">
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
              :bubbleModel="bubbleModel"
              :msg="item"
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
} from '@lanshu/utils';
import {
  LsIcon,
  LsAssets,
  LsCardDialog,
  LsFriendPanel,
} from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';
import { TimesTransform } from '@lanshu/components';
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
    isMainSession: {
      type: Boolean,
      default: false,
    },
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
      myGroupRole: -1,
      groupRoleManager: {},
    };
  },
  watch: {
    session: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (val?.sessId === oldVal?.sessId) return;
        // TODO 临时处理手动创建会话时 mainSessionWindow 的更新问题
        if (val && val?.nickname) {
          console.log('111 session', val);
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
          console.log('2222 currentMsg', msg);
          this.getMessageList();
          this.setCurrentMsg({});
        }
      },
    },
    refreshMsg(val) {
      if (val) {
        console.log('3333 refreshMsg', val);
        this.getMessageList();
      }
    },
    refreshGroupRoleManager() {
      console.log('refreshGroupRoleManager');
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
    }
  },
  computed: {
    ...mapGetters('IMStore', [
      'userInfo',
      'currentMsg',
      'refreshMsg',
      'refreshGroupRoleManager',
      'groupUserAttributeChanged',
      'groupMemberDeleteCallBack',
    ]),
    toAvatar() {
      return this.session.avatar;
    },
    isGroup() {
      return this.session.toUserType === SESSION_USER_TYPE.IS_GROUP;
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

    const dragWrapper = document.querySelector('.im-view');
    //添加拖拽事件监听器
    dragWrapper.addEventListener('drop', (e) => {
      //阻止默认行为
      e.preventDefault();
      //获取文件列表
      const files = e.dataTransfer.files;
      console.log(files);

      if (files?.length > 0) {
        //获取文件路径
        const path = files[0].path;
        console.log('path:', path);
        // 禁止发言
        if (
          this.isGroup &&
          this.groupRoleManager.whoCanSendMessage > this.myGroupRole
        ) {
          this.$message.warning('暂无权限！');
          return;
        }
        this.setDragFileList(files);
      }
    });

    //阻止拖拽结束事件默认行为
    dragWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
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
      console.log(sessId, this.nextSeq);
      // 拉取SDK缓存消息，每次sdk最多返回20条消息
      IMGetMessageList(sessId, this.nextSeq).then((res) => {
        console.log('拉取成功', res.data);
        const { msgs, nextSeq, hasNext } = res?.data || {};
        this.hasNext = hasNext;
        this.nextSeq = nextSeq;
        if (isContinue && this.messageList?.length) {
          this.messageList.unshift(...msgs);
          this.$nextTick(() => {
            const currentScrollHeight = this.$refs.messagePanel.scrollHeight;
            this.$refs.messagePanel.scrollTop =
              currentScrollHeight - this.preScrollHeight + this.scrollTop;
          });
        } else {
          this.messageList = msgs;
          this.$nextTick(() => {
            this.$refs.messagePanel.scrollTop =
              this.$refs.messagePanel.scrollHeight;
          });
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
          this.preScrollHeight = this.$refs.messagePanel.scrollHeight;
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
      console.log(item);
      const isSelf = this.checkSelf(item);
      if (isSelf) return;
      const { fromUser } = item;
      const friendInfo = (await IMGetOneFriend(fromUser))?.data || {};
      if (friendInfo?.userId) {
        this.friendPanelConfig = { isDetails: true };
      } else {
        this.friendPanelConfig = { isApply: true };
      }

      const userProfile = (await IMGetUserProfile(fromUser))?.data || {};
      const { remark, desc } = friendInfo;
      this.openFriendDialog(
        {
          ...userProfile,
          remark,
          desc,
        },
        event,
      );
    },

    handlePushLocalMsg(msg) {
      this.messageList.push(msg);
      this.$nextTick(() => {
        this.$refs.messagePanel.scrollTop =
          this.$refs.messagePanel.scrollHeight;
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
          console.log(res.data);
          this.groupRoleManager = res?.data || {};
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getMyGroupMemberInfo() {
      const res = await IMGetMyGroupMemberInfo(this.session.toUser);
      const { role } = res?.data || {};
      this.myGroupRole = role || this.myGroupRole;
    },
  },
};
</script>

<style scoped lang="scss">
.im-view {
  height: 100%;
  background-color: $bg-IM-color;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
  //border-radius: 10px 10px 0 0;
  width: 500px;
  min-width: 500px;
  margin-left: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  position: relative;

  &:first-child {
    margin-left: 0;
    flex: 1;
    //border-radius: 0 10px 0 0;
    width: auto;
  }

  .message-panel {
    flex: 1;
    padding: 0px 20px;
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
