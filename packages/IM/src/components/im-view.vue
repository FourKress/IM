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
          <!--          <span>你邀请李安林、于时放加入了群聊</span>-->
          <span v-if="!baseMsgTypes.includes(item.msgType)">{{ msgFormatMap[item.msgType]?.label(item.data) }}</span>
        </div>

<!--        :class="checkSelf(item) ? 'self' : 'target'"-->
        <div
          v-if="baseMsgTypes.includes(item.msgType)"
          class="msg-row target"
        >
          <div class="img">
            <img :src="checkSelf(item) ? userInfo.avatar : toAvatar" alt="" />
          </div>
          <div class="info">
            <MsgCard :isSelf="checkSelf(item)" :msg="item" />
            <div class="send-tips" v-if="item.sendState !== 1">
              <img class="loading-icon" v-if="item.sendState === 0" :src="LsAssets.loadingIcon" alt="">
              <span class="send-error" v-if="item.sendState === -1" @click="handleResendMsg">
              <LsIcon render-svg width='17' height='17' icon='a-zt_ts_icon2x'></LsIcon>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  _throttle,
  checkTimesInterval,
  baseMsgTypes,
  msgFormatMap,
} from '@lanshu/utils';
import { TimesTransform } from '@lanshu/components';
import MsgCard from './msg-view/msg-card';
import MsgHeader from './msg-view/msg-header';
import MsgInputAction from './msg-view/msg-input-action';
import { LsIcon, LsAssets } from '@lanshu/components';
import { IMGetMessageList } from '../IM-SDK';

export default {
  name: 'ImView',
  components: {
    TimesTransform,
    MsgCard,
    MsgHeader,
    MsgInputAction,
    LsIcon,
  },
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
      messageList: [],
      hasNext: true,
      nextSeq: 0,
      throttleGetMessageList: null,

      scrollTop: 0,
      accept: '',
      baseMsgTypes,
      msgFormatMap,
      LsAssets,
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
        }
      },
    },
    refreshMsg(val) {
      if (val) {
        console.log('12312312123312123');
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
  },
  async mounted() {
    // this.initData();
    this.throttleGetMessageList = _throttle(this.getMessageList);
  },
  methods: {
    ...mapActions('IMStore', ['setRefreshMsg']),

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

    handleRefreshMsg() {
      this.getMessageList();
    },

    handleResendMsg() {
      console.log('重发')
    }
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
            right: -25px;

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
