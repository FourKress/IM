<template>
  <div class="im-view">
    <div class="top">
      <div class="left">
        <div class="img">
          <img :src="toAvatar" alt="" />
        </div>
        <div class="info">
          <span class="name">{{ session.nickname }}</span>
          <span class="tips">顶顶顶顶</span>
        </div>
      </div>
      <div class="right">
        <div class="btn close" @click="handleCloseSession"></div>
        <div class="btn switch"></div>
        <div class="btn text-icon-btn">
          <span class="btn-icon"></span>
          <span>协同</span>
        </div>
      </div>
    </div>

    <div class="message-panel" ref="messagePanel" @scroll="handleScroll">
      <div
        class="message-item"
        :class="item.fromUser !== userInfo.userId ? 'target' : 'self'"
        v-for="(item, index) in messageList"
      >
        <div class="img">
          <img :src="index % 2 === 0 ? toAvatar : userInfo.avatar" alt="" />
        </div>
        <div class="info">{{ item.data.content }} {{ index + 1 }}</div>
      </div>
    </div>

    <div class="action-panel">
      <div class="input-panel">
        <div class="input-wrap">
          <input
            type="textarea"
            :rows="5"
            placeholder="发送给 休息下..."
            v-model="message"
          />

          <div class="btn-list">
            <div class="btn"></div>
            <div class="btn"></div>
            <div class="btn"></div>
            <div class="btn"></div>
          </div>
        </div>
        <div class="send-btn" @click="sendMsg"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { renderProcess } from '@lanshu/render-process';
import { _throttle } from '@lanshu/utils/src/lodash';

export default {
  name: 'ImView',
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
  },
  data() {
    return {
      messageList: [],
      isCompleted: false,
      nextMsgId: null,
      throttleGetMessageList: null,
      message: '',
    };
  },
  watch: {},
  computed: {
    ...mapGetters('global', ['userInfo']),
    toAvatar() {
      return this.session.avatar;
    },
  },
  created() {
    this.getMessageList();
    this.throttleGetMessageList = _throttle(this.getMessageList);
  },
  methods: {
    ...mapActions('global', ['removeSessionWindowList']),

    getMessageList(isContinue = false) {
      const sessId = this.session?.sessId;
      if (!sessId) return;
      if (this.isCompleted) return;
      if (!isContinue) {
        this.nextMsgId = null;
      }
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
        } else {
          this.messageList = messageList;
          this.$nextTick(() => {
            this.$refs.messagePanel.scrollTop =
              this.$refs.messagePanel.scrollHeight;
          });
        }
      });
    },

    handleScroll(event) {
      const scrollTop = event.target.scrollTop;
      if (scrollTop <= 50) {
        this.throttleGetMessageList(true);
      }
    },

    handleCloseSession() {
      if (this.isMainSession) return;
      this.removeSessionWindowList(this.session);
    },

    sendMsg() {
      const textMsg = IMSDK.createTextMessage({
        content: this.message, //文本内容
        toUser: this.session.userId, //消息接收方，为会话列表中的toUser
        toUserType: this.session.toUserType, //消息接收方类型，为会话列表中的toUserType
      });

      IMSDK.sendMessage(textMsg)
        .then((e) => {
          console.log('消息发送成功', e);
          this.getMessageList();
        })
        .catch((e) => {
          console.log('消息发送失败', e);
        });
    },

    async handleClick() {
      const filePath = await renderProcess.openFile();
      this.filePath = filePath;
    },
    handleScreenshots() {
      renderProcess.startScreenshots();
      renderProcess.getScreenshots((event, value) => {
        if (value) {
          this.imgB64 = `data:image/png;base64,${value}`;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.im-view {
  height: 100%;
  background-color: #f6f7fb;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
  border-radius: 10px 10px 0 0;
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
    border-radius: 0 10px 0 0;
    width: auto;
  }

  .top {
    height: 66px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;

    .left {
      flex: 1;
      display: flex;
      align-items: center;

      .img {
        display: block;
        width: 46px;
        height: 46px;
        border-radius: 6px;
        margin-right: 10px;
        overflow: hidden;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }

      }

      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .name {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          margin-bottom: 5px;
        }

        .tips {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .right {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .btn {
        margin-right: 20px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        &.close {
          width: 16px;
          height: 16px;
          background-color: #333333;
        }

        &.switch {
          width: 16px;
          height: 16px;
          background-color: #333333;
        }

        &.text-icon-btn {
          width: 60px;
          height: 28px;
          background: #e7eaf3;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;
          color: #333333;

          .btn-icon {
            width: 12px;
            height: 12px;
            background-color: #333333;
            margin-right: 2px;
          }
        }
      }
    }
  }

  .message-panel {
    flex: 1;
    padding: 20px 20px 0 20px;
    overflow-y: auto;
    transform: translate3d(0, 0, 0);

    .message-item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-bottom: 16px;
      transform: translate3d(0, 0, 0);

      &:last-child {
        margin-bottom: 0;
      }

      .img {
        width: 50px;
        min-width: 50px;
        height: 50px;
        background: #9482ff;
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
        padding: 15px;
        box-sizing: border-box;
        background: #e7eaf3;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        font-size: 14px;
        color: #333333;
        line-height: 20px;
      }

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
    }
  }

  .action-panel {
    width: 100%;
    min-height: 100px;
    padding: 20px;
    box-sizing: border-box;

    .input-panel {
      min-height: 60px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 10px;
      border: 2px solid rgba(148, 130, 255, 0.5);
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .input-wrap {
        flex: 1;
        min-height: 28px;
        border-right: 1px solid #eaeaea;
        font-size: 14px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn-list {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-left: 16px;

          .btn {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-right: 20px;
            background-color: #333333;
          }
        }

        input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
        }

        input::placeholder {
          color: #999999;
          font-size: 14px;
        }
      }

      .send-btn {
        width: 18px;
        height: 18px;
        cursor: pointer;
        margin-left: 17px;
        background-color: #333333;
      }
    }
  }
}
</style>
