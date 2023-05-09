<template>
  <div class="action-panel">
    <div class="input-panel">
      <div class="options-row">
        <el-popover
          v-model="emojiVisible"
          placement="top"
          width="460"
          trigger="manual"
        >
          <div class="emoji-panel">
            <span
              class="emoji"
              v-for="emoji in EMOJI_LIST"
              :key="emoji"
              @click="getEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
          <div
            slot="reference"
            class="btn emoji-btn"
            @click="handleSwitchEmoji"
          >
            <LsIcon render-svg icon="xx_srk_bq"></LsIcon>
          </div>
        </el-popover>

        <div class="btn" @click="handleScreenshots">
          <LsIcon render-svg icon="xx_srk_jt"></LsIcon>
        </div>

        <div class="btn">
          <ActionCard
            v-if="!noGroupAuth"
            :session="session"
            :groupRole="groupRole"
            :groupRoleManager="groupRoleManager"
            @actionComplete="handleActionComplete"
          />
        </div>

        <div class="right">
          <span
            class="send-btn"
            :class="disabledSendMsg && 'disabled'"
            @click="sendMsg"
          >
            发送
          </span>
        </div>
      </div>
      <div
        class="input-textarea"
        :contenteditable="!noGroupAuth"
        @keyup.enter.exact="handleEnterSend"
        @keyup.ctrl.enter.exact="handleCtrlEnterSend"
        ref="msgInput"
        :placeholder="placeholder"
        @input="handleInput"
        @blur="handleBlur"
      ></div>
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
import {
  EMOJI_LIST,
  KEY_CODE,
  CHECK_MSG_TYPE,
  SESSION_USER_TYPE,
} from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { LsIcon } from '@lanshu/components';
import ActionCard from '../action-view/action-card';
import {
  IMSDKMessageProvider,
  IMCreateMsg,
  IMSendMessage,
  IMUploadFile,
} from '../../IM-SDK';

export default {
  name: 'Msg-input-action',
  props: {
    groupRole: {
      type: Number,
      default: -1,
    },
    groupRoleManager: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    LsIcon,
    ActionCard,
  },
  data() {
    return {
      message: '',
      messageText: '',
      inputClientWidth: 0,
      EMOJI_LIST,
      emojiVisible: false,
      windowRange: null,
      sendMsgHotKey: null,
      KEY_CODE,
      CHECK_MSG_TYPE,
    };
  },
  computed: {
    session() {
      return this.$attrs.session;
    },
    recordrtc() {
      return this.$attrs.recordrtc;
    },
    placeholder() {
      return this.noGroupAuth
        ? '群主已禁言'
        : `发送给 ${this.session.nickname || ''}...`;
    },
    disabledSendMsg() {
      const emptyMsg =
        !this.message || (!this.messageText && !this.message.includes('<img'));
      return emptyMsg || this.noGroupAuth;
    },
    noGroupAuth() {
      return (
        this.isGroup && this.groupRoleManager.whoCanSendMessage > this.groupRole
      );
    },
    isGroup() {
      return this.session?.toUserType === SESSION_USER_TYPE.IS_GROUP;
    },
  },
  async mounted() {
    this.$nextTick(() => {
      this.$refs.msgInput.focus();
      this.windowRange = window.getSelection().getRangeAt(0);
    });

    document.addEventListener('click', this.handleGlobalClick);
    document.querySelector('.input-textarea').addEventListener('paste', (e) => {
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
      await renderProcess.getStore('HOT_KEYS')
    ).sendMsg.currentKey;

    if (this.sendMsgHotKey === this.KEY_CODE.IS_ENTER) {
      document.onkeydown = (e) => {
        if (e.key === this.KEY_CODE.IS_ENTER) {
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
      if (this.sendMsgHotKey === this.KEY_CODE.IS_ENTER) {
        this.sendMsg();
      }
    },
    handleCtrlEnterSend() {
      if (this.sendMsgHotKey === this.KEY_CODE.IS_CTRL_ENTER) {
        this.sendMsg();
      } else {
        this.windowRange = window.getSelection().getRangeAt(0);
        const innerText = this.$refs.msgInput.innerText;
        const endOffset = this.windowRange.endOffset;
        const before = `${innerText ? '<br>' : ''}`;
        const after = `<br>${
          !innerText || innerText?.length === endOffset ? '<br>' : ''
        }`;
        const brNode = `${before}${after}`;
        this.handleTargetInsert(brNode);
      }
    },
    handleInput() {
      const element = this.$refs.msgInput;
      const innerHTML = element.innerHTML;
      if (!innerHTML || !innerHTML.replace(/<br>/g, '')) {
        this.message = '';
        this.$nextTick(() => {
          this.$refs.msgInput.focus();
        });
        return;
      }
      this.message = element.innerHTML;
      this.messageText = element.innerText.trim();
    },
    handleBlur(event) {
      this.$refs.msgInput = event.target;
      this.windowRange = window.getSelection().getRangeAt(0);
    },
    clearInput() {
      this.$nextTick(() => {
        if (this.$refs.msgInput) {
          this.$refs.msgInput.innerHTML = '';
        } else {
          this.$refs.msgInput.focus();
        }
        this.message = '';
      });
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

      this.handleInput();
    },
    getEmoji(emoji) {
      this.emojiVisible = false;
      this.handleTargetInsert(emoji);
    },

    handleSwitchEmoji() {
      if (this.noGroupAuth) {
        this.$message.warning('暂无权限！');
        return;
      }
      this.emojiVisible = !this.emojiVisible;
    },

    handleScreenshots() {
      if (this.noGroupAuth) {
        this.$message.warning('暂无权限！');
        return;
      }
      renderProcess.startScreenshots().then((value) => {
        if (value) {
          const b64 = `data:image/png;base64,${value}`;
          this.handleImageInsert(b64);
        }
      });
    },

    handleImageInsert(base64Url) {
      const innerText = this.$refs.msgInput.innerText;
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

    handleIMSendMsg(msg, cb) {
      IMSendMessage(msg)
        .finally(() => {
          this.$emit('refreshMsg', msg);
        });
      this.$emit('pushMsg', msg);
      cb && cb();
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

    recursionReplace(msg) {
      const reg = /&nbsp; ?$/;
      if (reg.test(msg)) {
        const str = msg.replace(reg, '');
        return this.recursionReplace(str);
      }
      return msg;
    },

    async sendMsg() {
      if (this.disabledSendMsg) return;

      const regExp = new RegExp(
        /(<img src="\S*" alt(="")?>|[a-zA-Z0-9\u4e00-\u9fa5])+/g,
        'g',
      );
      const realMessage = this.recursionReplace(
        this.message.replace(/<span|div>|<\/span|div>/g, '<br>'),
      );
      const msgArr = realMessage.includes('<img')
        ? realMessage.match(regExp)?.filter((d) => d !== 'br') || [realMessage]
        : [realMessage];

      const sendMsgArr = await Promise.all(
        msgArr
          .map(async (d) => {
            let msg = null;
            if (d.includes('<img')) {
              const b64 = d.replace(/(<img src=")(\S+)(" \S*)/, '$2');
              const file = this.dataURLtoFile(b64);
              const { name, size, type } = file;
              const url = await this.handleFileUpload(b64);
              if (!url) return;

              const { width, height } = await this.getImageSize(url);
              msg = await this.handleCreateMsg(
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
              msg = await this.handleCreateMsg({
                type: this.CHECK_MSG_TYPE.IS_TEXT,
                message: d,
              });
            }

            return msg;
          })
          .filter((msg) => msg),
      );

      sendMsgArr.forEach((d) => {
        this.handleIMSendMsg(d, this.clearInput);
      });
    },

    async handleCreateMsg(params, url = '') {
      console.log('msg', params);
      let msgEvent = null;
      let msgData = [
        this.session.toUser, //消息接收方，为会话列表中的toUser
        this.session.toUserType, //消息接收方类型，为会话列表中的toUserType];
      ];
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
        case this.CHECK_MSG_TYPE.IS_TEXT:
          msgEvent = IMSDKMessageProvider.events.createTextMessage;
          msgData.push(message);
          break;
        case this.CHECK_MSG_TYPE.IS_IMAGE:
          msgEvent = IMSDKMessageProvider.events.createImgMessage;
          msgData.push({
            name,
            type: rawType,
            size,
            md5: '',
            smallUrl: url,
            url,
            high: height,
            wide: width,
          });
          break;
        case this.CHECK_MSG_TYPE.IS_VIDEO:
          msgEvent = IMSDKMessageProvider.events.createVideoMessage;
          msgData.push({
            type: rawType,
            size,
            time,
            videoUrl: url,
            snapshotUrl: url,
          });
          break;
        case this.CHECK_MSG_TYPE.IS_AUDIO:
          msgEvent = IMSDKMessageProvider.events.createVoiceMessage;
          msgData.push({
            md5: '',
            type: rawType,
            size,
            time,
            url,
          });
          break;
        case this.CHECK_MSG_TYPE.IS_FILE:
          msgEvent = IMSDKMessageProvider.events.createFileMessage;
          msgData.push({
            md5: '',
            name,
            type: rawType,
            size,
            url,
          });
          break;
        default:
          break;
      }

      return await IMCreateMsg(msgEvent, msgData);
    },

    async handleFileUpload(filePath) {
      return new Promise(async (resolve) => {
        console.log(filePath);
        await IMUploadFile(filePath)
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
      if (type === this.CHECK_MSG_TYPE.IS_SEND_FILE) {
        const sendMsgArr = (
          await Promise.all(
            value.map(async (d) => {
              const filePath = d.file.path;
              const url = await this.handleFileUpload(filePath);
              if (!url) return;
              console.log(d);
              return await this.handleCreateMsg(d, url);
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
  min-height: 160px;
  box-sizing: border-box;

  .input-panel {
    min-height: 160px;
    box-sizing: border-box;
    background: $bg-white-color;
    padding: 0 0px 16px 20px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;

    .options-row {
      width: 100%;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .btn {
        width: 18px;
        height: 18px;
        cursor: pointer;
        margin-right: 20px;
      }

      .right {
        flex: 1;
        text-align: right;

        .send-btn {
          width: 64px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          font-size: 12px;
          color: $bg-white-color;
          background: $primary-color;
          border-radius: 4px;
          cursor: pointer;
          display: inline-block;
          margin-right: 14px;

          &.disabled {
            cursor: not-allowed;
            background: #87a1cd;
          }
        }
      }
    }

    .input-textarea {
      width: 100%;
      height: 100%;
      min-height: 92px;
      line-height: 21px;
      border: none;
      outline: none;
      font-size: 14px;
      overflow-y: auto;
      white-space: normal;
      word-break: break-all;
      max-height: 340px;

      &:empty::before {
        content: attr(placeholder);
        color: $tips-text-color;
        font-size: 14px;
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
