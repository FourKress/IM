<template>
  <div class="action-panel">
    <div class="input-panel">
      <div class="row">
        <div
          v-if="showBigTextarea"
          :contenteditable="true"
          class="input-textarea big"
          @keyup.enter.exact="handleEnterSend"
          @keyup.ctrl.enter.exact="handleCtrlEnterSend"
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
              @keyup.enter.exact="handleEnterSend"
              @keyup.ctrl.enter.exact="handleCtrlEnterSend"
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
              <ActionCard @actionComplete="handleActionComplete" />
            </div>
          </div>
        </div>
        <div class="right">
          <div
            class="send-btn"
            :class="!message && 'disabled'"
            @click="sendMsg"
          >
            <LsIcon render-svg :icon="message ? 'xx_srk_fs_nor' : 'xx_srk_fs_dis'"></LsIcon>
          </div>
        </div>
      </div>
    </div>

    <!--      <video-->
    <!--        ref="myVideo"-->
    <!--        id="myVideo"-->
    <!--        playsinline-->
    <!--        autoplay-->
    <!--        controls-->
    <!--        preload="auto"-->
    <!--        poster-->
    <!--        width="300"-->
    <!--        height="300"-->
    <!--      ></video>-->
    <!--      <audio-->
    <!--        ref="myAudio"-->
    <!--        id="audio"-->
    <!--        controls-->
    <!--        preload="auto"-->
    <!--        width="300"-->
    <!--        height="100"-->
    <!--      ></audio>-->

  </div>
</template>

<script>
import { emojiList, keyCode, checkMsgType } from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { LsIcon } from '@lanshu/components';
import ActionCard from '../action-view/action-card';
import { mapGetters } from 'vuex';

export default {
  name: 'Msg-input-action',
  components: {
    LsIcon,
    ActionCard,
  },
  data() {
    return {
      message: '',
      showBigTextarea: false,
      refInput: null,
      inputClientWidth: 0,
      emojiList,
      emojiVisible: false,
      windowRange: null,
      sendMsgHotKey: null,
      keyCode,
      checkMsgType,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['IM_Status', 'SDK_NOT_READ']),
    session() {
      return this.$attrs.session;
    },
    recordrtc() {
      return this.$attrs.recordrtc;
    },
    placeholder() {
      return `发送给 ${this.session.nickname || ''}...`;
    },
  },
  async mounted() {
    this.$nextTick(() => {
      this.refInput = this.$refs.msgInput;
    });
    document.addEventListener('click', this.handleGlobalClick);
    document.querySelector('.action-panel').addEventListener('paste', (e) => {
      this.handleBlur(e);
      const items = e.clipboardData.items;
      let isFileFlag = false;
      for (let item of items) {
        if (!isFileFlag && item.kind === 'file') {
          isFileFlag = true;
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = () => {
            this.$nextTick(() => {
              this.handleImageInsert(reader.result);
            });
          };
          reader.readAsDataURL(blob);
        }
      }
      if (isFileFlag) e.preventDefault();
    });

    this.sendMsgHotKey = (
      await renderProcess.getStore('hotKeys')
    ).sendMsg.currentKey;

    if (this.sendMsgHotKey === this.keyCode.isEnter) {
      document.onkeydown = (e) => {
        if (e.key === this.keyCode.isEnter) {
          e.preventDefault(); //禁用回车的默认事件
        }
      };
    }
  },
  methods: {
    init() {
      this.windowRange = null;
      this.emojiVisible = false;
      this.clearInput();
    },
    handleGlobalClick(event) {
      if (!this.emojiVisible) return;
      try {
        const classNames = (event.target.className || '')?.split(' ');
        if (
          !classNames.some((c) => ['input-textarea', 'emoji-btn'].includes(c))
        ) {
          this.emojiVisible = false;
        }
      } catch (e) {}
    },

    handleEnterSend() {
      if (this.sendMsgHotKey === this.keyCode.isEnter) {
        this.sendMsg();
      }
    },
    handleCtrlEnterSend() {
      if (this.sendMsgHotKey === this.keyCode.isCtrlEnter) {
        this.sendMsg();
      } else {
        this.windowRange = window.getSelection().getRangeAt(0);
        const innerText = this.refInput.innerText;
        const endOffset = this.windowRange.endOffset;
        const before = `${innerText ? '<br>' : ''}`;
        const after = `<br>${
          !innerText || innerText?.length === endOffset ? '<br>' : ''
        }`;
        const brNode = `${before}${after}`;
        this.handleTargetInsert(brNode);
      }
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
      if (!innerHTML) {
        this.message = '';
        return;
      };
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
        this.message = '';
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
    handleBlur(event) {
      this.refInput = event.target;
      this.windowRange = window.getSelection().getRangeAt(0);
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

    handleScreenshots() {
      renderProcess.startScreenshots().then((value) => {
        if (value) {
          const b64 = `data:image/png;base64,${value}`;
          this.handleImageInsert(b64);
        }
      });
    },

    handleImageInsert(base64Url) {
      const innerText = this.refInput.innerText;
      const endOffset = this.windowRange.endOffset;
      const before = `${innerText ? '<br>' : ''}`;
      const after = `<br>${
        !innerText || innerText?.length === endOffset ? '<span><br></span>' : ''
      }`;
      const imageNode = `${before}<img src='${base64Url}' alt=''>${after}`;

      this.handleTargetInsert(imageNode);
    },

    // 录制音视频相关
    // handleStartAudioRecord() {
    //   if (!this.recordrtc) {
    //     console.error('音频录制启动失败');
    //     return;
    //   }
    //   if (this.recordrtc.isRecorder) return;
    //   this.recordrtc.startAudioRecording();
    // },
    // async handleStopAudioRecord() {
    //   if (!this.recordrtc.isRecorder) return;
    //   const blob = await this.recordrtc.stopAudioRecording();
    //   console.log(blob);
    //   this.$refs.myAudio.src = blob;
    // },
    // handleStartVideoRecord() {
    //   if (!this.recordrtc) {
    //     console.error('音视频录制启动失败');
    //     return;
    //   }
    //   if (this.recordrtc.isRecorder) return;
    //   this.recordrtc.startVideoRecording(this.$refs.myVideo);
    // },
    // async handleStopVideoRecord() {
    //   if (!this.recordrtc.isRecorder) return;
    //   const blob = await this.recordrtc.stopVideoRecording(this.$refs.myVideo);
    //   console.log(blob);
    // },

    dataURLtoFile(dataUrl) {
      let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        b64Str = atob(arr[1]),
        n = b64Str.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = b64Str.charCodeAt(n);
      }
      return new File([u8arr], Date.now().toString(), { type: mime });
    },

    async handleIMSendMsg(msg, cb) {
      await IMSDK.sendMessage(msg)
        .then((e) => {
          console.log('消息发送成功', e);
          this.$emit('refreshMsg');
          cb && cb();
        })
        .catch((e) => {
          console.log('消息发送失败', e);
        });
    },

    async getImageSize(url) {
      return new Promise((resolve) => {
        const newImage = new Image();
        newImage.src = url;
        newImage.onload = () => {
          resolve({ width: newImage.width, height: newImage.height });
        };
      });
    },

    async sendMsg() {
      if (this.IM_Status === this.SDK_NOT_READ) return;
      if (!this.message) return;
      console.log(this.message);

      const regExp = new RegExp(
        /(<img src="\S*" alt(="")?>|[a-zA-Z0-9\u4e00-\u9fa5])+/g,
        'g',
      );
      const msgArr = this.message
        .replace(/<span|div>|<\/span|div>/g, '<br>')
        .match(regExp)
        .filter((d) => d !== 'br');

      const sendMsgArr = await Promise.all(
        msgArr.map(async (d) => {
          let msg = null;
          if (d.includes('<img')) {
            const b64 = d.replace(/(<img src=")(\S+)(" \S*)/, '$2');
            const file = this.dataURLtoFile(b64);
            const { name, size, type } = file;

            const url = await this.handleFileUpload(file);

            const { width, height } = await this.getImageSize(url);
            msg = this.handleCreateMsg(
              {
                name,
                type: type.replace(/\/[a-z]+/g, ''),
                rawType: type,
                size,
                height,
                width,
              },
              url,
            );
          } else {
            msg = this.handleCreateMsg({
              type: this.checkMsgType.isText,
              message: d,
            });
          }

          return msg;
        }),
      );

      sendMsgArr.forEach((d) => {
        this.handleIMSendMsg(d, this.clearInput);
      });
    },

    handleCreateMsg(params, url = '') {
      let msg = null;
      const baseData = {
        toUser: this.session.toUser, //消息接收方，为会话列表中的toUser
        toUserType: this.session.toUserType, //消息接收方类型，为会话列表中的toUserType
      };
      const {
        size = 0,
        name = '',
        type = '',
        rawType = '',
        width = 0,
        height = 0,
        time = 0,
        message = '',
      } = params;
      switch (type) {
        case this.checkMsgType.isText:
          msg = IMSDK.createTextMessage({
            content: message, //文本内容
            ...baseData,
          });
          break;
        case this.checkMsgType.isImage:
          msg = IMSDK.createImgMessage({
            data: {
              name,
              type: rawType,
              size,
              high: height,
              wide: width,
              url,
              smallUrl: url,
            },
            ...baseData,
          });
          break;
        case this.checkMsgType.isVideo:
          msg = IMSDK.createVideoMessage({
            data: {
              type: rawType,
              size,
              time,
              videoUrl: url,
              snapshotUrl: url,
            },
            ...baseData,
          });
        case this.checkMsgType.isAudio:
          msg = IMSDK.createVoiceMessage({
            data: {
              type: rawType,
              size,
              time,
              url,
            },
            ...baseData,
          });

        case this.checkMsgType.isFile:
          msg = IMSDK.createFileMessage({
            data: {
              name,
              type: rawType,
              size,
              url,
            },
            ...baseData,
          })
        default: break;
      }

      return msg;
    },

    async handleFileUpload(file) {
      return new Promise(async (resolve) => {
        await IMSDK.FileApi.uploadFile(file, (event) => {
          if (event.lengthComputable) {
            console.log(event);
          }
        })
          .then((res) => {
            resolve(res.data.url);
          })
          .catch((error) => {
            console.log(error);
            this.$message.error('文件上传失败!');
            resolve();
          });
      });
    },

    async handleActionComplete(data) {
      const { value, type } = data;
      if (type === this.checkMsgType.isSendFile) {
        const sendMsgArr = (
          await Promise.all(
            value.map(async (d) => {
              const file = d.file;
              const url = await this.handleFileUpload(file);
              if (!url) return;
              console.log(d);
              return this.handleCreateMsg(d, url);
            }),
          )
        ).filter((d) => d);

        sendMsgArr.forEach((d) => {
          this.handleIMSendMsg(d);
        });
      }
    },
  },
  destroyed() {
    document.removeEventListener('click', this.handleGlobalClick);
    document.onkeydown = null;
  },
};
</script>

<style scoped lang="scss">
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
