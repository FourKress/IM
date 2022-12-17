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
        <div class="btn" @click="handleCloseSession"></div>
        <div class="btn"></div>
        <div class='btn'>
          <el-dropdown trigger='click'>
            <span class='more'>···</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class='send-down-row'>
                  <LsIcon render-svg icon="=pop_cd_cjql"></LsIcon>
                  <span>创建群聊</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class='send-down-row'>
                  <LsIcon render-svg icon="pop_cd_sz"></LsIcon>
                  <span>设置</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="message-panel" ref="messagePanel" @scroll="handleScroll">
      <div
        class="message-item"
        :class="item.fromUser !== userInfo.userId ? 'target' : 'self'"
        v-for="item in messageList"
      >
        <div class="img">
          <img
            :src="
              item.fromUser !== userInfo.userId ? toAvatar : userInfo.avatar
            "
            alt=""
          />
        </div>
        <div class="info">{{ item.data.content }}</div>
      </div>
      <video
        ref="myVideo"
        id="myVideo"
        playsinline
        autoplay
        controls
        preload="auto"
        poster
        width="300"
        height="300"
      ></video>
      <audio
        ref="myAudio"
        id="audio"
        controls
        preload="auto"
        width="300"
        height="100"
      ></audio>
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
        <div class="row small-row">
          <div class="input-wrap">
            <div class="input-content-editable">
              <div
                v-if="!showBigTextarea"
                :contenteditable="true"
                class="input-textarea small"
                ref="msgInput"
                :placeholder="placeholder"
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
                >
                  <LsIcon render-svg icon="xx_srk_bq"></LsIcon>
                </div>
              </el-popover>

              <div class="btn" @click="handleScreenshots">
                <LsIcon render-svg icon="xx_srk_jt"></LsIcon>
              </div>

              <div class="btn">
                <el-dropdown placement='top' trigger='click'>
                  <LsIcon render-svg icon="xx_srk_gd"></LsIcon>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div class='send-down-row'>
                        <LsIcon render-svg icon="=pop_cd_tp"></LsIcon>
                        <span>图片/视频</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div class='send-down-row'>
                        <LsIcon render-svg icon="pop_cd_wj"></LsIcon>
                        <span>文件</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div class='send-down-row'>
                        <LsIcon render-svg icon="pop_cd_sb"></LsIcon>
                        <span>OCR识别</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div class='send-down-row'>
                        <LsIcon render-svg icon="pop_cd_mp"></LsIcon>
                        <span>名片</span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="right">
            <div
              class="send-btn"
              :class="!message && 'disabled'"
              @click="sendMsg"
            >
              <LsIcon render-svg icon="xx_srk_fs_dis"></LsIcon>
            </div>
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
import { LsIcon } from '@lanshu/components';

export default {
  name: 'ImView',
  components: {
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
      isCompleted: false,
      nextMsgId: null,
      throttleGetMessageList: null,
      message: '',
      showBigTextarea: false,
      refInput: null,
      inputClientWidth: 0,
      emojiList,
      emojiVisible: false,
      windowRange: null,
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
      'IM_Status',
      'SDK_NOT_READ',
      'currentMsg',
    ]),
    toAvatar() {
      return this.session.avatar;
    },
    placeholder() {
      return `发送给 ${this.session.nickname || ''}...`;
    },
  },
  mounted() {
    this.initData();
    this.throttleGetMessageList = _throttle(this.getMessageList);
    document.addEventListener('click', this.handleGlobalClick);
  },
  methods: {
    ...mapActions('IMStore', ['removeSessionWindowList']),

    initData() {
      this.windowRange = null;
      this.emojiVisible = false;
      this.messageList = [];
      this.nextMsgId = null;
      this.isCompleted = false;
      this.clearInput();
      this.getMessageList();
    },
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
      if (scrollTop <= 50) {
        this.throttleGetMessageList(true);
      }
    },

    handleCloseSession() {
      if (this.isMainSession) return;
      this.removeSessionWindowList(this.session);
    },

    sendMsg() {
      if (this.IM_Status === this.SDK_NOT_READ) return;
      if (!this.message) return;
      console.log(this.message);
      console.log(this.refInput.innerText);

      const dtoQuoteReg = new RegExp(/^<img[\s\S]* alt(="")?>/g, 'g');
      let hasDtoQuote = this.message.match(dtoQuoteReg);
      console.log(hasDtoQuote);

      // return;
      // const textMsg = IMSDK.createTextMessage({
      //   content: this.message, //文本内容
      //   toUser: this.session.toUser, //消息接收方，为会话列表中的toUser
      //   toUserType: this.session.toUserType, //消息接收方类型，为会话列表中的toUserType
      // });
      const imgMsg = IMSDK.createImgMessage({
        data: {
          name: '图片.jpg',
          type: 'jpg',
          size: 1024,
          time: 43,
          high: 500,
          wide: 900,
          url: 'www.baidu.com',
          smallUrl: 'www.baidu.com',
        },
        toUser: this.session.toUser, //消息接收方，为会话列表中的toUser
        toUserType: this.session.toUserType, //消息接收方类型，为会话列表中的toUserType
      });

      return;

      IMSDK.sendMessage(textMsg)
        .then((e) => {
          console.log('消息发送成功', e);
          this.clearInput();
          this.getMessageList();
        })
        .catch((e) => {
          console.log('消息发送失败', e);
        });
    },

    clearInput() {
      this.$nextTick(() => {
        if (this.refInput) {
          this.refInput.innerHTML = '';
        } else {
          this.refInput = this.$refs.msgInput;
          this.refInput.focus();
        }
        this.showBigTextarea = false;
        this.message = '';
      });
    },
    handleBlur(event) {
      this.refInput = event.target;
      this.windowRange = window.getSelection().getRangeAt(0);
    },
    selectHandleInput() {
      if (this.showBigTextarea) {
        this.handleBigInput();
      } else {
        this.handleInput();
      }
    },
    handleInput() {
      const element = this.$refs.msgInput;
      const innerHTML = element.innerHTML;
      if (!innerHTML) return;
      const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element;
      if (scrollWidth > clientWidth || scrollHeight > clientHeight) {
        const caretOffset = this.getRange(element);
        this.showBigTextarea = true;
        this.inputClientWidth = clientWidth;
        this.message = innerHTML;
        element.innerHTML = '';
        this.$nextTick(() => {
          this.inputCallback(this.$refs.msgBigInput, caretOffset);
        });
      } else {
        this.getInputValue(element);
        this.showBigTextarea = false;
      }
    },
    handleBigInput() {
      const element = this.$refs.msgBigInput;
      const innerHTML = element.innerHTML;
      if (!innerHTML || !innerHTML.replace(/<br>/g, '')) {
        this.showBigTextarea = false;
        this.$nextTick(() => {
          this.$refs.msgInput.focus();
        });
        return;
      }
      const { clientWidth, scrollHeight } = element;
      if (this.inputClientWidth > clientWidth && scrollHeight < 21) {
        const caretOffset = this.getRange(element);
        this.showBigTextarea = false;
        this.message = element.innerHTML;
        element.innerHTML = '';
        this.$nextTick(() => {
          this.inputCallback(this.$refs.msgInput, caretOffset);
        });
      } else {
        this.getInputValue(element);
        this.showBigTextarea = true;
      }
    },
    inputCallback(element, caretOffset) {
      this.refInput = element;
      this.refInput.focus();
      this.refInput.innerHTML = this.message;
      this.setRange(this.refInput, caretOffset);
    },
    getInputValue(element) {
      console.log(element.innerHTML);
      this.message = element.innerHTML;
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
        if (targetNode) {
          range.setStart(
            targetNode,
            targetNode.length ? targetOffset + (targetNode.length || 0) : 0,
          );
        } else {
          range.setStart(element.lastChild, element.lastChild.length || 0);
        }
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
    handleTargetInsert(node) {
      const selection = window.getSelection();
      const range = this.windowRange;
      range.collapse(false);
      let hasR = range.createContextualFragment(node);
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

      this.selectHandleInput();
    },
    getEmoji(emoji) {
      this.emojiVisible = false;
      this.handleTargetInsert(emoji);
    },

    async handleClick() {
      const filePath = await renderProcess.openFile();
      this.filePath = filePath;
    },
    handleScreenshots() {
      renderProcess.startScreenshots().then((value) => {
        if (value) {
          const base64Url = `data:image/png;base64,${value}`;
          const innerText = this.refInput.innerText;
          const endOffset = this.windowRange.endOffset;
          const before = `${innerText ? '<br>' : ''}`;
          const after = `<br>${
            !innerText || innerText?.length === endOffset
              ? '<span><br></span>'
              : ''
          }`;
          const imageNode = `${before}<img src='${base64Url}' alt=''>${after}`;

          this.handleTargetInsert(imageNode);
        }
      });
    },

    handleStartAudioRecord() {
      if (!this.recordrtc) {
        console.error('音频录制启动失败');
        return;
      }
      if (this.recordrtc.isRecorder) return;
      this.recordrtc.startAudioRecording(this.$refs.myAudio);
    },
    async handleStopAudioRecord() {
      if (!this.recordrtc.isRecorder) return;
      const blob = await this.recordrtc.stopAudioRecording();
      console.log(blob);
      this.$refs.myAudio.src = blob;
    },

    handleStartVideoRecord() {
      if (!this.recordrtc) {
        console.error('音视频录制启动失败');
        return;
      }
      if (this.recordrtc.isRecorder) return;
      this.recordrtc.startVideoRecording(this.$refs.myVideo);
    },
    async handleStopVideoRecord() {
      if (!this.recordrtc.isRecorder) return;
      const blob = await this.recordrtc.stopVideoRecording(this.$refs.myVideo);
      console.log(blob);
    },
  },
};
</script>

<style scoped lang="scss">
.im-view {
  height: 100%;
  background-color: $bg-IM-color;
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
    box-sizing: border-box;
    background-color: $bg-white-color;
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
          color: $main-text-color;
          margin-bottom: 5px;
        }

        .tips {
          font-size: 12px;
          color: $tips-text-color;
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
        width: 16px;
        height: 16px;
        background-color: #333333;

        &:last-child {
          margin-right: 0;
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
        background: $bubble-IM-color;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        font-size: 14px;
        color: #fff;
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
      background: $bg-white-color;
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

        &.small-row {
          overflow-y: hidden;
        }
      }

      .input-textarea {
        width: 100%;
        height: 100%;
        min-height: 21px;
        max-height: 21px;
        line-height: 21px;
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
          margin-bottom: 16px;
          max-height: 340px;
        }

        &:empty::before {
          content: attr(placeholder);
          color: $tips-text-color;
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
        height: 21px;
        border-left: 1px solid $split-line-color;
      }

      .input-wrap {
        flex: 1;
        align-items: flex-end;
        min-height: 21px;
        box-sizing: border-box;
        font-size: 14px;
        overflow-x: hidden;

        .btn-list {
          width: 122px;
          display: flex;
          align-items: center;
          height: 21px;
          margin-left: 16px;
          overflow: hidden;

          .btn {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-right: 20px;
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

        &.disabled {
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.emoji-panel {
  display: grid;
  justify-content: space-between;
  justify-items: center;
  align-content: flex-start;
  align-items: center;
  grid-row-gap: 16px;
  grid-column-gap: 12px;
  grid-template-columns: repeat(12, 20px);

  .emoji {
    display: inline-block;
    cursor: pointer;
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
}

.send-down-row {
  display: flex;
  align-items: center;

  .ls-icon-wrap {
    width: 14px;
    height: 14px;
    margin-right: 11px;
  }
}
</style>
