<template>
  <div class="im-view">
    <MsgHeader v-bind="$props" v-on="$listeners" />

    <div class="message-panel" ref="messagePanel" @scroll="handleScroll">
      <div
        class="message-item"
        v-for="(item, index) in messageList"
        :key="item.msgId"
      >
        <div class="tips-row">
          <TimesTransform
            v-if="
              checkTimesInterval(
                item.timestamp,
                messageList[Math.max(index - 1, 0)].timestamp,
              )
            "
            :timestamp="item.timestamp"
          />
          <span v-if="!BASE_MSG_TYPES.includes(item.msgType)">
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
          :style="{minHeight: !checkSelf(item) && isGroup ? '68px' : '50px'}"
        >
          <div class="img" @click="(event) => handleFriend(item, event)">
            <MsgLazyAvatar
              :is-self="checkSelf(item)"
              :session="session"
              :message="item"
            ></MsgLazyAvatar>
          </div>
          <div class="nickname" v-if="!checkSelf(item) && isGroup">
            <MsgLazyNickname :message="item" />
          </div>
          <div class="info" :style="{marginTop: !checkSelf(item) && isGroup ? '18px' : 0}">
            <MsgCard
              :isSelf="checkSelf(item)"
              :bubbleModel="bubbleModel"
              :msg="item"
            />
            <div
              class="send-tips"
              :class="
                checkSelf(item) && bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN
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

    <MsgInputAction v-bind="$props" @refreshMsg="handleRefreshMsg" />

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
        :config="{ isDetails: true }"
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
import MsgLazyAvatar from './msg-view/msg-lazy-avatar';
import MsgLazyNickname from "./msg-view/msg-lazy-nickname";

import { IMGetMessageList, IMGetOneFriend, IMGetUserProfile } from '../IM-SDK';

export default {
  name: 'ImView',
  components: {
    TimesTransform,
    MsgCard,
    MsgHeader,
    MsgInputAction,
    MsgLazyAvatar,
    MsgLazyNickname,
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
      accept: '',

      showFriendDialog: false,
      bubbleModel: SESSION_BUBBLE_MODEL.IS_BETWEEN,
    };
  },
  watch: {
    session: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
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
        this.setRefreshMsg(false);
        this.getMessageList();
      }
    },
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'currentMsg', 'refreshMsg']),
    toAvatar() {
      return this.session.avatar;
    },
    isGroup() {
      return this.session.toUserType === SESSION_USER_TYPE.IS_GROUP;
    },
  },
  async mounted() {
    // this.initData();
    this.bubbleModel = await renderProcess.getStore('SESSION_BUBBLE_MODEL');
    this.throttleGetMessageList = lodash.throttle(this.getMessageList, 20, {
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
        this.setDragFileList(files);
      }
    });

    //阻止拖拽结束事件默认行为
    dragWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  },
  methods: {
    ...mapActions('IMStore', [
      'setRefreshMsg',
      'setDragFileList',
      'setCurrentMsg',
    ]),

    checkTimesInterval,
    initData() {
      this.messageList = [];
      this.nextSeq = 0;
      this.hasNext = true;
      this.getMessageList();
    },
    checkSelf(item) {
      return item.fromUser === this.userInfo.userId;
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
        const { msgs, nextSeq, hasNext } = res.data;
        this.hasNext = hasNext;
        this.nextSeq = nextSeq;
        if (isContinue && this.messageList?.length) {
          this.messageList.unshift(...msgs);
          this.$refs.messagePanel.scrollTop = 100;
        } else {
          this.messageList = msgs;
          this.$nextTick(() => {
            this.$refs.messagePanel.scrollTop =
              this.$refs.messagePanel.scrollHeight;
          });
        }
      });
    },

    handleScroll(event) {
      if (!this.hasNext) return;
      const scrollTop = event.target.scrollTop;
      if (
        scrollTop <= 200 &&
        (scrollTop <= this.scrollTop || this.scrollTop === 0)
      ) {
        this.scrollTop = scrollTop;
        this.throttleGetMessageList(true);
      }
    },

    async handleFriend(item, event) {
      const isSelf = this.checkSelf(item);
      if (isSelf) return;
      const { fromUser } = item;
      const userProfile = (await IMGetUserProfile(fromUser))?.data || {};
      let friendInfo = {};
      friendInfo = (await IMGetOneFriend(fromUser))?.data || {};
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

    handleRefreshMsg() {
      this.getMessageList();
    },

    handleResendMsg() {
      console.log('重发');
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

        background-color: transparent;
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

          .img {
            margin-left: 10px;
          }
        }

        &.target {
          padding-right: 60px;

          .img {
            margin-right: 10px;
          }
        }

        .img {
          width: 50px;
          min-width: 50px;
          height: 50px;
          border-radius: 6px;
          overflow: hidden;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .nickname {
          font-size: 12px;
          color: $tips-text-color;
          position: absolute;
          left: 60px;
          top: -3px;
          z-index: 2;
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
