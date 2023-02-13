<template>
  <div class="im-view">
    <MsgHeader v-bind="$props" v-on="$listeners" />

    <div class="message-panel" ref="messagePanel" @scroll="handleScroll">
      <div class="message-item" v-for="(item, index) in messageList">
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
          <span>你邀请李安林、于时放加入了群聊</span>
        </div>
        <div
          class="msg-row"
          :class="checkSelf(item) ? 'self' : 'target'"
        >
          <div class="img">
            <img
              :src="
                checkSelf(item) ? userInfo.avatar : toAvatar
              "
              alt=""
            />
          </div>
          <div class="info">
            <MsgCard :isSelf='checkSelf(item)' :msg="item" />
          </div>
        </div>
      </div>
    </div>

    <MsgInputAction v-bind="$props" @refreshMsg="handleRefreshMsg" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { _throttle, checkTimesInterval } from '@lanshu/utils';
import { TimesTransform } from '@lanshu/components';
import MsgCard from './msg-view/msg-card';
import MsgHeader from './msg-view/msg-header';
import MsgInputAction from './msg-view/msg-input-action';

export default {
  name: 'ImView',
  components: {
    TimesTransform,
    MsgCard,
    MsgHeader,
    MsgInputAction,
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
      isCompleted: false,
      nextMsgId: null,
      throttleGetMessageList: null,

      scrollTop: 0,
      accept: '',
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
  },
  computed: {
    ...mapGetters('IMStore', [
      'userInfo',
      'currentMsg',
    ]),
    toAvatar() {
      return this.session.avatar;
    },
  },
  async mounted() {
    this.initData();
    this.throttleGetMessageList = _throttle(this.getMessageList);
  },
  methods: {
    checkTimesInterval,
    initData() {
      this.messageList = [];
      this.nextMsgId = null;
      this.isCompleted = false;
      this.getMessageList();
    },
    checkSelf(item) {
      return item.fromUser === this.userInfo.userId
    },

    getMessageList(isContinue = false) {
      const sessId = this.session?.sessId;
      if (!sessId) return;
      if (!isContinue) {
        this.nextMsgId = null;
      }
      console.log(sessId, this.nextMsgId);
      // 拉取SDK缓存消息，每次sdk最多返回20条消息
      IMSDK.getMessageList({
        nextMsgId: this.nextMsgId,
        sessId, // 会话id
      }).then((e) => {
        console.log('拉取成功', e.data);
        const { messageList, nextMsgId, isCompleted } = e.data;
        this.isCompleted = isCompleted;
        this.nextMsgId = nextMsgId;
        if (isContinue && this.messageList?.length) {
          this.messageList.unshift(...messageList);
          this.$refs.messagePanel.scrollTop = 100;
        } else {
          this.messageList = messageList;
          this.$nextTick(() => {
            this.$refs.messagePanel.scrollTop = this.$refs.messagePanel.scrollHeight;
          });
        }
      });
    },

    handleScroll(event) {
      if (this.isCompleted) return;
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

          font-size: 14px;
          color: $main-text-color;
          line-height: 20px;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
