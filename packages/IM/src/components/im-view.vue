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
        <div class="info">{{ item.data.content }}</div>
      </div>
    </div>

    <div class="action-panel">
      <div class="input-panel">
        <div class="row">
          <div
            v-if="showBigTextarea"
            :contenteditable="true"
            class="input-textarea big"
            ref="msgBigInput"
            @input="handleBigInput"
            @blur="handleBlur"
          ></div>
        </div>
        <div class="row">
          <div class="input-wrap">
            <div class="input-content-editable">
              <div
                v-if="!showBigTextarea"
                :contenteditable="true"
                class="input-textarea small"
                ref="msgInput"
                :placeholder="`发送给 休息下...`"
                @input="handleInput"
                @blur="handleBlur"
              ></div>
            </div>

            <div class="btn-list">
              <el-popover
                v-model="emojiVisible"
                placement="top"
                width="460"
                trigger="manual"
              >
                <div class="emoji-panel">
                  <span
                    class="emoji"
                    v-for="emoji in emojiList"
                    :key="emoji"
                    @click="getEmoji(emoji)"
                  >
                    {{ emoji }}
                  </span>
                </div>
                <div
                  slot="reference"
                  class="btn emoji-btn"
                  @click="emojiVisible = !emojiVisible"
                ></div>
              </el-popover>

              <div class="btn"></div>
              <div class="btn"></div>
              <div class="btn"></div>
            </div>
          </div>
          <div class="right">
            <div class="send-btn" @click="sendMsg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { renderProcess } from '@lanshu/render-process';
import { emojiList, _throttle } from '@lanshu/utils';

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
      showBigTextarea: false,
      inputClientWidth: 0,
      emojiList,
      emojiVisible: false,
      windowRange: true,
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
  mounted() {
    document.addEventListener('click', this.handleGlobalClick);
  },
  methods: {
    ...mapActions('global', ['removeSessionWindowList']),

    handleGlobalClick(event) {
      if (!this.emojiVisible) return;
      const classNames = (event.target.className || '').split(' ');
      if (
        !classNames.some((c) => ['input-textarea', 'emoji-btn'].includes(c))
      ) {
        this.emojiVisible = false;
      }
    },
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
          this.showBigTextarea = false;
          if (this.showBigTextarea) {
            this.$refs.msgInput.innerHTML = '';
          } else {
            this.$refs.msgBigInput.innerHTML = '';
          }
          this.message = '';
          this.getMessageList();
        })
        .catch((e) => {
          console.log('消息发送失败', e);
        });
    },

    handleInput() {
      const element = this.$refs.msgInput;
      const innerHTML = element.innerHTML;
      this.message = innerHTML;
      if (!innerHTML) return;
      const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element;
      if (scrollWidth > clientWidth || scrollHeight > clientHeight) {
        const caretOffset = this.getRange(element);
        this.showBigTextarea = true;
        this.inputClientWidth = clientWidth;
        element.innerHTML = '';
        this.$nextTick(() => {
          this.$refs.msgBigInput.focus();
          this.$refs.msgBigInput.innerHTML = this.message;
          this.setRange(this.$refs.msgBigInput, caretOffset);
        });
      } else {
        this.showBigTextarea = false;
      }
    },
    handleBlur() {
      this.windowRange = window.getSelection().getRangeAt(0);
    },
    handleBigInput() {
      const element = this.$refs.msgBigInput;
      const innerHTML = element.innerHTML;
      if (!innerHTML) {
        this.showBigTextarea = false;
        return;
      }
      const { clientWidth } = element;
      if (this.inputClientWidth > clientWidth) {
        const caretOffset = this.getRange(element);
        this.showBigTextarea = false;
        this.message = element.innerHTML;
        element.innerHTML = '';
        this.$nextTick(() => {
          this.$refs.msgInput.focus();
          this.$refs.msgInput.innerHTML = this.message;
          this.setRange(this.$refs.msgInput, caretOffset);
        });
      } else {
        this.showBigTextarea = true;
      }
    },
    getRange(element) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    },
    setRange(element, caretOffset) {
      // 创建一个选中区域
      const range = document.createRange();
      // 选中节点的内容
      range.selectNodeContents(element);
      const childNodes = element.childNodes;
      if (childNodes?.length > 1) {
        let targetNode;
        let targetOffset = caretOffset;
        let count = 0;
        childNodes.forEach((n) => {
          const textLength = n.innerHTML?.length || 0;
          if (targetNode) return;
          count += textLength;
          targetOffset -= textLength;
          if (count >= caretOffset) {
            targetNode = n.firstChild;
          }
        });
        range.setStart(targetNode, targetOffset + targetNode.length);
      } else {
        const childNode = element.childNodes[0];
        const targetNode = childNode?.firstChild || childNode;
        range.setStart(targetNode, caretOffset);
      }
      // 设置选中区域为一个点
      range.collapse(true);
      // 获取当前选中区域
      const selection = window.getSelection();
      // 移除所有的选中范围
      selection.removeAllRanges();
      // 添加新建的范围
      selection.addRange(range);
    },

    getEmoji(emoji) {
      this.emojiVisible = false;
      const selection = window.getSelection();
      const range = this.windowRange;
      range.collapse(false);
      let hasR = range.createContextualFragment(emoji);
      let hasR_lastChild = hasR.lastChild;
      while (
        hasR_lastChild &&
        hasR_lastChild.nodeName.toLowerCase() == 'br' &&
        hasR_lastChild.previousSibling &&
        hasR_lastChild.previousSibling.nodeName.toLowerCase() == 'br'
      ) {
        let e = hasR_lastChild;
        hasR_lastChild = hasR_lastChild.previousSibling;
        hasR.removeChild(e);
      }
      range.insertNode(hasR);
      if (hasR_lastChild) {
        range.setEndAfter(hasR_lastChild);
        range.setStartAfter(hasR_lastChild);
      }
      selection.removeAllRanges();
      selection.addRange(range);

      if (this.showBigTextarea) {
        this.handleBigInput();
      } else {
        this.handleInput();
      }
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
    padding: 16px 20px;
    box-sizing: border-box;

    .input-panel {
      min-height: 60px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 10px;
      border: 2px solid rgba(148, 130, 255, 0.5);
      padding: 16px 20px;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow-x: auto;
      }

      .input-textarea {
        height: 100%;
        min-height: 23px;
        max-height: 23px;
        line-height: 23px;
        margin-bottom: 5px;
        border: none;
        outline: none;
        white-space: nowrap;
        font-size: 14px;
        overflow-y: auto;

        &.small {
          &::-webkit-scrollbar {
            display: none;
          }
        }

        &.big {
          white-space: normal;
          word-break: break-all;
          word-break: break-word;
          margin-bottom: 0;
          max-height: 340px;
        }

        &:empty::before {
          content: attr(placeholder);
          color: #999999;
          font-size: 14px;
        }
      }

      .input-wrap,
      .right {
        display: flex;
        justify-content: space-between;
      }

      .right {
        align-items: center;
        height: 33px;
        border-left: 1px solid #eaeaea;
      }

      .input-wrap {
        flex: 1;
        align-items: flex-end;
        min-height: 33px;
        box-sizing: border-box;
        font-size: 14px;
        overflow-x: hidden;

        .btn-list {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 23px;
          margin: 0 0 5px 16px;

          .btn {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-right: 20px;
            background-color: #333333;
          }
        }

        .input-content-editable {
          width: 100%;
          overflow-x: hidden;
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

<style lang="scss">
.emoji-panel {
  .emoji {
    display: inline-block;
    padding: 8px;
    cursor: pointer;

    &:nth-child(14n) {
      padding-right: 0;
    }
    &:nth-child(14n + 1) {
      padding-left: 0;
    }
  }
}
</style>
