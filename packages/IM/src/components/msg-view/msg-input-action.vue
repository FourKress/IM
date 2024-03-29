<template>
  <div
    class="action-panel"
    ref="ActionPanel"
    :class="isSynergy && 'small-action'"
  >
    <div class="input-panel">
      <div class="options-row">
        <el-popover
          placement="top"
          width="460"
          trigger="click"
          v-model="emojiVisible"
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
            <el-tooltip
              class="item"
              effect="dark"
              content="表情"
              placement="top"
            >
              <LsIcon render-svg icon="xx_srk_bq"></LsIcon>
            </el-tooltip>
          </div>
        </el-popover>

        <div class="btn" @click="handleScreenshots">
          <el-tooltip
            class="item"
            effect="dark"
            :content="`截图(${screenshotHotKey})`"
            placement="top"
          >
            <LsIcon render-svg icon="xx_srk_jt"></LsIcon>
          </el-tooltip>
        </div>

        <div class="btn">
          <ActionCard
            v-if="!noSendAuth"
            ref="ActionCard"
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
        ref="InputTextarea"
        :style="{
          paddingRight: isScroll ? '0' : '8px',
        }"
      >
        <div
          class="editor-container"
          :contenteditable="true"
          @keyup.enter.exact="handleEnterEvent(KEY_CODE.IS_ENTER)"
          @keyup.ctrl.enter.exact="handleEnterEvent(KEY_CODE.IS_CTRL_ENTER)"
          ref="msgInput"
          :placeholder="placeholder"
          @input="handleInput"
          @blur="handleBlur"
        ></div>
      </div>

      <div class="at-member-panel" v-if="visibleMemberDialog">
        <div class="scroll-view" ref="MemberContainer">
          <div
            class="member-item"
            :class="{
              active: selectMemberIndex === atAllMember.userId,
              [`member-item_${atAllMember.userId}`]: true,
            }"
            v-if="!atKeywords"
            @click="handleSelectMember(atAllMember)"
          >
            <LsIcon
              class="img"
              icon="ls-icon-suoyouren"
              width="36"
              height="36"
              render-svg
            ></LsIcon>
            <span class="name">{{ atAllMember.nickname }}</span>
          </div>
          <div class="tips">群成员</div>
          <template v-if="members.length">
            <div
              class="member-item"
              :class="{
                active: selectMemberIndex === index,
                [`member-item_${index}`]: true,
              }"
              v-for="(item, index) in members"
              @click="
                handleSelectMember(
                  item,
                  atSearchInfo.node && atSearchInfo.offset,
                )
              "
            >
              <img class="img" :src="item.avatar" alt="" />
              <span class="name">{{ item.alias }}</span>
            </div>
          </template>
          <div class="empty-tips" v-else>没有匹配结果</div>
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
import {
  EMOJI_LIST,
  KEY_CODE,
  CHECK_MSG_TYPE,
  SESSION_USER_TYPE,
  lodash,
  GROUP_ROLE_TYPE_LOCAL,
  PLACEHOLDER_CONFIG,
  openAtUser,
} from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { LsIcon } from '@lanshu/components';
import ActionCard from '../action-view/action-card';
import { mapActions, mapGetters } from 'vuex';
import {
  IMSDKMessageProvider,
  IMCreateMsg,
  IMSendMessage,
  IMUploadFile,
  IMGetGroupMemberList,
} from '../../IM-SDK';

const atAllMember = {
  userId: 'IM_AT_ALL',
  nickname: '所有人',
};

export default {
  name: 'Msg-input-action',
  props: {
    groupRole: {
      type: Number,
      default: null,
    },
    groupRoleManager: {
      type: Object,
      default: () => {},
    },
    isSynergy: {
      type: Boolean,
      default: false,
    },
    memberCount: {
      type: Number,
      default: 0,
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
      screenshotHotKey: null,
      KEY_CODE,
      CHECK_MSG_TYPE,
      rawMembers: [],
      nextSeq: 0,
      visibleMemberDialog: false,
      atTagDom: null,
      isScroll: false,
      atAllMember,
      selectMemberIndex: atAllMember.userId,
      atKeywords: '',
      atSearchInfo: {},
      atSearchTimer: 0,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'createSessionTextMsg']),

    session() {
      return this.$attrs.session;
    },
    recordrtc() {
      return this.$attrs.recordrtc;
    },
    placeholder() {
      if (this.isGroup && this.groupRole !== GROUP_ROLE_TYPE_LOCAL.IS_DEFAULT) {
        if (this.groupRole === GROUP_ROLE_TYPE_LOCAL.IS_NOT_AUTH)
          return '您不是该群成员！';
        if (this.noSendAuth) return '群主已禁言';
      }
      return `发送给 ${this.session.nickname || ''}...`;
    },
    disabledSendMsg() {
      const emptyMsg =
        !this.message || (!this.messageText && !this.message.includes('<img'));
      return emptyMsg || this.noSendAuth;
    },
    noSendAuth() {
      return (
        (this.isGroup &&
          (this.groupRole === GROUP_ROLE_TYPE_LOCAL.IS_DEFAULT ||
            this.groupRoleManager.whoCanSendMessage > this.groupRole)) ||
        ![
          SESSION_USER_TYPE.IS_GROUP,
          SESSION_USER_TYPE.IS_BASIC,
          SESSION_USER_TYPE.IS_BOT,
        ].includes(this.session.toUserType)
      );
    },
    isGroup() {
      return this.session?.toUserType === SESSION_USER_TYPE.IS_GROUP;
    },
    members() {
      const members = this.rawMembers.filter((d) =>
        d.alias.includes(this.atKeywords),
      );
      if (this.atKeywords) this.selectMemberIndex = 0;
      return members;
    },
  },
  watch: {
    visibleMemberDialog(val) {
      if (val) {
        this.selectMemberIndex = this.atKeywords ? 0 : this.atAllMember.userId;
        this.$refs.ActionPanel.addEventListener(
          'keyup',
          this.handleHotKeySelectMember,
        );
      } else {
        this.$refs.ActionPanel.removeEventListener(
          'keyup',
          this.handleHotKeySelectMember,
        );
      }
    },
    memberCount() {
      if (!this.isGroup) return;
      this.getGroupMemberList();
    },
    createSessionTextMsg(val) {
      if (!val) return;
      this.setCreateSessionTextMsg('');
      this.clearInput();
      this.handleTargetInsert(val);
    },
  },
  async mounted() {
    this.$nextTick(async () => {
      // 协同模式不自动聚焦
      if (!this.isSynergy) {
        this.handleFocus();
      }
      this.windowRange = this.getRange();
      // 非协同模式 读取草稿
      if (this.isSynergy) return;
      // 获取切换时保存的临时草稿
      const historyTempMsgOBJ = await window.$lanshuStore.getItem('tempMsgOBJ');
      const tempMsg = historyTempMsgOBJ?.[this.session.sessId];
      if (tempMsg?.preview) {
        this.handleTargetInsert(tempMsg.rawMsg, false, () => {
          if (this.isGroup) {
            this.handleRangeCollapseToEnd();
            const atTagDom = [
              ...document.querySelectorAll('.at-container'),
            ].pop();
            if (atTagDom) {
              this.atTagDom = atTagDom;
            }
          }
        });
      }
    });

    document.addEventListener('click', this.handleAtGlobalClick);
    this.$refs.msgInput.addEventListener('paste', async (event) => {
      this.handleBlur();
      event.preventDefault();
      let text;
      const clp = (event.originalEvent || event).clipboardData;
      if (clp === undefined || clp === null) {
        text = window.clipboardData.getData('text') || '';
      } else {
        text = clp.getData('text/plain') || '';
      }
      if (text) {
        this.handleTargetInsert(document.createTextNode(text), true);
        return;
      }

      const pasteFilesList = [];
      const items = event.clipboardData.items;
      for (const item of items) {
        // 图片类型
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (item.type.includes('image')) {
            this.handleBlobLoadImage(file);
          } else {
            pasteFilesList.push(file);
          }
        }
      }

      try {
        const clipboardContents = await navigator.clipboard?.read();
        for (const clipboardItem of clipboardContents) {
          for (const type of clipboardItem.types) {
            const blob = await clipboardItem.getType(type);
            if (type.includes('image')) {
              this.handleBlobLoadImage(blob);
            } else {
              let [fileType, fileName] = type
                .replace(PLACEHOLDER_CONFIG.CUSTOM_PROTOCOL, '')
                .split(PLACEHOLDER_CONFIG.FILE_NAME_SEPARATOR);
              if (fileName.includes(PLACEHOLDER_CONFIG.RAW_NAME_SEPARATOR)) {
                fileName = decodeURIComponent(
                  fileName.split(PLACEHOLDER_CONFIG.RAW_NAME_SEPARATOR)[1],
                );
              }
              const tempFile = this.handleBlob2File(blob, fileName, fileType);
              pasteFilesList.push(tempFile);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }

      if (pasteFilesList?.length) {
        await this.setDragFileList({
          sessId: this.session.sessId,
          files: pasteFilesList,
        });
      }
    });

    const hotKeyDB = await renderProcess.getStore('HOT_KEYS');

    this.sendMsgHotKey = hotKeyDB.sendMsg.currentKey;
    this.screenshotHotKey = hotKeyDB.screenshot.currentKey;

    this.$refs.msgInput.onkeydown = (event) => {
      if (event.key === this.KEY_CODE.IS_ENTER) {
        event.preventDefault(); //禁用回车的默认事件
      }
      if (this.isGroup) {
        // 拦截@ 自定义处理
        const { shiftKey, key } = event;
        if (shiftKey && key === '@') {
          this.windowRange = this.getRange();
          const nowTime = Date.now();
          this.handleTargetInsert(
            `<span class='at-container' contenteditable="false" data-at="${nowTime}">@</span>`,
          );
          this.atTagDom = document.querySelector(`[data-at="${nowTime}"]`);
          this.handleCheckAt();
          event.preventDefault();
        }

        // 选择AT人员时，禁止使用左右方向按键
        if (
          ['ArrowUp', 'ArrowDown'].includes(event.key) &&
          this.visibleMemberDialog
        ) {
          event.preventDefault();
        }
      }
    };

    if (this.isGroup) {
      this.$refs.msgInput.onkeyup = (event) => {
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
          this.handleAuthActionAt();
          return;
        }
      };
      this.$refs.msgInput.onmouseup = (event) => {
        if (event.button === 0) {
          this.handleAuthActionAt();
        }
      };

      // 给动态生成的html标签绑定事件，挂载到window上;
      window.openAtUser = (event) => openAtUser(this, event);
    }
  },
  methods: {
    ...mapActions('IMStore', ['setDragFileList', 'setCreateSessionTextMsg']),

    handleBlobLoadImage(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.$nextTick(() => {
          this.handleImageInsert(reader.result);
        });
      };
      reader.readAsDataURL(file);
    },

    handleBlob2File(blob, fileName, type) {
      const file = new window.File([blob], fileName, {
        type,
      });
      return file;
    },

    getRange() {
      return window.getSelection()?.getRangeAt(0);
    },
    handleAtGlobalClick(event) {
      if (!this.visibleMemberDialog) return;
      try {
        const path = [...event.path];
        const notPopover = path.every(
          (d) =>
            !['action-panel', 'editor-container', 'at-member-panel'].includes(
              d.className,
            ),
        );
        if (notPopover) {
          this.visibleMemberDialog = false;
        }
      } catch (e) {}
    },
    handleHotKeySelectMember(event) {
      const { key } = event;
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(key)) {
        event.preventDefault();
        let { selectMemberIndex, members, atAllMember } = this;
        if (key === 'Enter') {
          this.initAtValue();
          const { node, offset } = this.atSearchInfo;
          const isAtSearch = node && offset;

          if (selectMemberIndex === atAllMember.userId) {
            this.handleSelectMember(atAllMember);
          } else {
            this.handleSelectMember(members[selectMemberIndex], isAtSearch);
          }
          return;
        }
        if (key === 'ArrowDown') {
          if (selectMemberIndex >= members.length - 1) {
            selectMemberIndex = this.atKeywords ? 0 : atAllMember.userId;
          } else {
            selectMemberIndex =
              selectMemberIndex === atAllMember.userId
                ? 0
                : selectMemberIndex + 1;
          }
        } else {
          if (selectMemberIndex === 0) {
            selectMemberIndex = this.atKeywords
              ? members.length - 1
              : atAllMember.userId;
          } else {
            selectMemberIndex =
              selectMemberIndex === atAllMember.userId
                ? members.length - 1
                : selectMemberIndex - 1;
          }
        }
        this.selectMemberIndex = selectMemberIndex;

        const target = document.querySelector(
          `.member-item_${selectMemberIndex}`,
        );
        this.$refs.MemberContainer.scrollTo({
          top: target.offsetTop - 10,
          behavior: 'smooth',
        });
      }
    },

    handleAuthActionAt() {
      const atDomList = document.querySelectorAll('.at-container');
      const atTagList = [...atDomList]
        // 存在at-tag, 说明已经是一个完整的AT标签，不需要处理
        .filter((d) => !d.querySelector('.at-tag'));
      if (!atTagList?.length) {
        this.visibleMemberDialog = false;
        return;
      }
      const rang = this.getRange();
      const selection = window.getSelection();
      // 没有任何选区，代表是最开始或者最结尾，根据内容匹配处理
      if (rang.endContainer.className === 'editor-container') {
        this.atSearchInfo = {};
        this.handleCheckAt(true);
        return;
      }
      // 获取前一个元素节点或者文本节点
      const preText = rang.startContainer?.previousSibling;
      const preEle = rang.startContainer?.previousElementSibling;
      const preNode = preText?.data ? preText : preEle;
      const hasAtTag = preNode && preNode?.innerText === '@';
      const { anchorOffset, anchorNode } = selection;
      const { data: anchorData } = anchorNode;
      const isAtSearch =
        anchorData &&
        anchorData?.slice(0, 1) !== ' ' &&
        anchorData?.slice(-1) !== ' ';
      const atKeywords = anchorData && anchorData?.substring(0, anchorOffset);
      if (rang.startOffset === 0 && hasAtTag) {
        // 光标处于选区开始位置 并且 @元素是选区前一个节点 则光标当前处于@符号处，触发@动作
        this.atTagDom = preNode;
        this.handleCheckAt();
      } else if (hasAtTag && isAtSearch && atKeywords) {
        // @元素是选区前一个节点 如果光标当前处于选区某个文本处，触发@动作 并且关键字搜索，关键字为选区开始到光标位置的字符串
        this.atKeywords = atKeywords;
        this.selectMemberIndex = 0;
        this.visibleMemberDialog = true;
        this.windowRange = rang;
        this.atSearchInfo = {
          node: anchorNode,
          offset: anchorOffset,
        };

        this.$nextTick(() => {
          this.atSearchTimer && clearTimeout(this.atSearchTimer);
          const members = this.rawMembers.filter((d) =>
            d.alias.includes(atKeywords),
          );
          if (!members?.length) {
            // 模糊匹配结果为空 延迟800ms 关闭at弹窗
            this.atSearchTimer = setTimeout(() => {
              this.handleCheckAt(true);
            }, 800);
          }
        });
      } else {
        this.visibleMemberDialog = false;
      }
    },

    handleRangDeleteContents() {
      this.windowRange.setStart(this.atSearchInfo.node, 0);
      this.windowRange.setEnd(this.atSearchInfo.node, this.atSearchInfo.offset);
      this.windowRange.deleteContents();
      this.handleTargetInsert(`&nbsp;`);
      this.atSearchInfo = {};
    },

    initAtValue() {
      this.atKeywords = '';
      this.selectMemberIndex = this.atAllMember.userId;
    },

    handleEnterEvent(keyType) {
      if (this.visibleMemberDialog) return;
      if (this.sendMsgHotKey === keyType) {
        this.sendMsg();
      } else {
        this.windowRange = this.getRange();
        this.handleTargetInsert('\n&zwnj;');
      }
    },
    handleCheckAt(isAuto = false) {
      this.initAtValue();
      if (isAuto) {
        const hasAt =
          this.session.toUserType === SESSION_USER_TYPE.IS_GROUP &&
          /[\s\S]?<span class="at-container" contenteditable="false" data-at="\d+">@<\/span>$/.test(
            this.message.replace(/<span><\/span>/g, ''),
          );
        this.visibleMemberDialog = hasAt;
      } else {
        this.visibleMemberDialog = true;
      }
    },
    handleSelectMember(member, isAtSearch = false) {
      this.message = this.message.slice(0, -1);
      this.messageText = this.messageText.slice(0, -1);
      this.windowRange = this.getRange();
      const { userId, nickname } = member;
      this.atTagDom.innerHTML = `<span class="at-tag" data-userid="${userId}" onclick='openAtUser(event)'>@${nickname}</span>`;
      if (isAtSearch) {
        this.handleRangDeleteContents();
      } else {
        this.handleTargetInsert(`&nbsp;`);
      }
      this.$nextTick(() => {
        this.visibleMemberDialog = false;
      });
    },

    handleRangeCollapseToEnd() {
      const msgInput = this.$refs.msgInput;
      const range = window.getSelection();
      // 处理光标并移动到最后
      if (msgInput.lastChild) {
        if (msgInput.lastChild?.innerText === '@') {
          range.selectAllChildren(msgInput);
          range.collapseToEnd();
        } else {
          range.selectAllChildren(msgInput.lastChild);
          range.collapse(msgInput.lastChild, msgInput.lastChild.length);
        }
      } else {
        range.selectAllChildren(msgInput);
        range.collapseToEnd();
      }
    },

    handleFocus() {
      this.$refs.msgInput?.focus();
      if (this.message) {
        this.handleRangeCollapseToEnd();
      }
      this.isGroup && this.handleAuthActionAt();
    },

    handleInput() {
      const element = this.$refs.msgInput;
      const innerHTML = element.innerHTML;
      if (!innerHTML || !innerHTML.replace(/\n/g, '')) {
        this.message = '';
        this.messageText = '';
        this.visibleMemberDialog = false;
        this.$nextTick(() => {
          this.$refs.msgInput.focus();
        });
        return;
      }
      this.message = element.innerHTML;
      this.messageText = element.innerText.trim();
      if (this.isGroup) {
        // 校验是否触发@事件
        this.handleAuthActionAt();
      }
      // 判断是否有滚动条
      this.isScroll =
        this.$refs?.InputTextarea?.scrollHeight >
        this.$refs?.InputTextarea?.clientHeight;
    },
    handleBlur() {
      this.windowRange = this.getRange();
    },
    clearInput() {
      this.message = '';
      this.messageText = '';
      if (this.$refs.msgInput) {
        this.$refs.msgInput.innerHTML = '';
        this.$refs.msgInput.focus();
      }
    },

    handleTargetInsert(content, isNode = false, cb) {
      const selection = window.getSelection();
      const range = this.getRange();
      range.collapse(false);
      if (isNode) {
        range.insertNode(content);
        range.setEndAfter(content);
        range.setStartAfter(content);
      } else {
        let hasR = range.createContextualFragment(content);
        let hasR_lastChild = hasR.lastChild;
        while (
          hasR_lastChild &&
          hasR_lastChild.nodeName.toLowerCase() === 'br' &&
          hasR_lastChild.previousSibling &&
          hasR_lastChild.previousSibling.nodeName.toLowerCase() === 'br'
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
      }

      selection.removeAllRanges();
      selection.addRange(range);

      cb && cb();

      this.handleInput();
    },
    getEmoji(emoji) {
      this.emojiVisible = false;
      this.handleTargetInsert(emoji);
    },

    handleSwitchEmoji() {
      if (this.noSendAuth) {
        this.$message.warning('暂无权限！');
        return;
      }
    },

    handleScreenshots() {
      if (this.noSendAuth) {
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
      const before = `${innerText ? '\n' : ''}`;
      const after = `\n${
        !innerText || innerText?.length === endOffset ? '<span>\n</span>' : ''
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

    handleIMSendMsg(msg) {
      IMSendMessage(msg);
      this.$emit('pushMsg', msg);
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

    sendMsg: lodash.throttle(
      async function () {
        if (this.disabledSendMsg) return;

        let realMessage;
        let isAtMsg = false;

        // 存在@
        if (this.message.includes('at-container')) {
          // 空@ 只是一个@符号，替换为@
          realMessage = this.message.replace(
            /<span class="at-container" contenteditable="false" data-at="\d+">@<\/span>/g,
            '@',
          );
          // 真实@
          if (realMessage.includes('data-userid')) {
            isAtMsg = true;
            const atRegExp =
              /<span class="at-container" contenteditable="false" data-at="\d+"><span class="at-tag" data-userid="(\d+|IM_AT_ALL)" onclick="openAtUser\(event\)">(@[\s\S]*?)<\/span><\/span>/;
            const atArr = realMessage.match(new RegExp(atRegExp, 'g'));

            const tempDom = document.createElement('span');
            const atUsers = atArr.map((d) => {
              tempDom.innerHTML = d;
              const userId = tempDom
                .querySelector('.at-tag')
                .getAttribute('data-userid');
              const nickname = tempDom.innerText;
              return {
                userId,
                nickname,
              };
            });

            atUsers.forEach((d) => {
              realMessage = realMessage.replace(
                atRegExp,
                `<at userId="${d.userId}">${d.nickname}</at>`,
              );
            });
          }
        } else {
          realMessage = this.message;
        }

        const regExp = new RegExp(/(<img src="\S*" alt(="")?>)+/g, 'g');
        realMessage = realMessage
          .replace(/(<(span|div)>)|(<\/(span|div)>)/g, '')
          .replace(/<br>/g, '\n')
          .replace(/\&nbsp;/g, ' ');

        let msgArr = [];
        if (realMessage.includes('<img')) {
          const imageArr = realMessage.match(regExp);
          const tempMsgArr = realMessage
            .replace(
              /(\n)?<img src="\S*" alt(="")?>(\n)?/g,
              `${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}${PLACEHOLDER_CONFIG.IMAGE_BR}${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}`,
            )
            .split(PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR);
          msgArr = tempMsgArr
            .map((d) => {
              let type = CHECK_MSG_TYPE.IS_TEXT;
              if (d === PLACEHOLDER_CONFIG.IMAGE_BR) {
                d = imageArr.splice(0, 1)[0];
                type = CHECK_MSG_TYPE.IS_IMAGE;
              }
              if (!d.replace(/\n/g, '')) d = '';
              return {
                type,
                value: d,
              };
            })
            .filter((d) => d.value);
        } else {
          msgArr = [
            {
              type: isAtMsg ? CHECK_MSG_TYPE.IS_AT : CHECK_MSG_TYPE.IS_TEXT,
              value: realMessage,
            },
          ];
        }

        this.clearInput();

        const sendMsgArr = await Promise.all(
          msgArr
            .map(async (d) => {
              const { value, type } = d;
              let msg = null;
              if (type === CHECK_MSG_TYPE.IS_IMAGE) {
                const b64 = value.replace(/(<img src=")(\S+)(" \S*)/, '$2');
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
                  type,
                  message: value,
                });
              }

              return msg;
            })
            .filter((msg) => msg),
        );

        await Promise.all(
          sendMsgArr.map(async (d) => {
            await this.handleIMSendMsg(d);
          }),
        );
      },
      400,
      {
        leading: true,
        trailing: false,
      },
    ),

    async handleCreateMsg(params, url = '') {
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
          const { dataURL, videoWidth, videoHeight } =
            await this.getVideoBase64(url);
          const snapshotUrl = await this.handleFileUpload(dataURL);
          msgEvent = IMSDKMessageProvider.events.createVideoMessage;
          msgData.push({
            type: rawType,
            size,
            time,
            videoUrl: url,
            snapshotUrl,
            high: parseInt(videoHeight),
            wide: parseInt(videoWidth),
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
        case this.CHECK_MSG_TYPE.IS_AT:
          msgEvent = IMSDKMessageProvider.events.createTextAtMessage;
          msgData.push(message);
          break;
        default:
          break;
      }

      return await IMCreateMsg(msgEvent, msgData);
    },

    getVideoBase64(url) {
      return new Promise(function (resolve) {
        const video = document.createElement('video');
        video.setAttribute('crossOrigin', 'anonymous'); //处理跨域
        video.setAttribute('src', url);
        video.setAttribute('preload', 'auto');
        video.addEventListener('loadeddata', function () {
          const canvas = document.createElement('canvas'),
            width = video.videoWidth / 3.85, //canvas的尺寸和图片一样
            height = video.videoHeight / 3.85;
          canvas.width = width;
          canvas.height = height;

          canvas.getContext('2d').drawImage(video, 0, 0, width, height);
          const dataURL = canvas.toDataURL('image/jpeg'); //转换为base64
          resolve({
            dataURL,
            videoWidth: width,
            videoHeight: height,
          });
        });
      });
    },

    async handleFileUpload(filePath) {
      return new Promise(async (resolve) => {
        await IMUploadFile(filePath)
          .then((res) => {
            resolve(res.data.url);
          })
          .catch((error) => {
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
              return await this.handleCreateMsg(d, url);
            }),
          )
        ).filter((d) => d);

        this.$refs.ActionCard.handleFileClose();

        sendMsgArr.forEach((d) => {
          this.handleIMSendMsg(d);
        });
      }
    },

    getGroupMemberList() {
      // nextSeq默认从0开始
      IMGetGroupMemberList(this.session.toUser, 0).then((res) => {
        const { nextSeq, members = [] } = res;
        this.nextSeq = nextSeq;
        this.rawMembers = members.map((d) => {
          return {
            ...d,
            alias: d.alias || d.nickname,
          };
        });
      });
    },
  },
  async beforeDestroy() {
    document.removeEventListener('click', this.handleAtGlobalClick);
    // 保存草稿
    const currentMsgText = this.messageText;
    const currentMsg = this.message;
    this.clearInput();

    let tempMsg = '';
    if (currentMsgText) {
      tempMsg = currentMsgText;
    } else if (currentMsg.includes('<img')) {
      tempMsg = '[图片]';
    }
    // 协同模式清空当前会话的草稿
    if (this.isSynergy) tempMsg = '';

    const sessId = this.session.sessId;
    const historyTempMsgOBJ = await window.$lanshuStore.getItem('tempMsgOBJ');

    await window.$lanshuStore.setItem('tempMsgOBJ', {
      ...historyTempMsgOBJ,
      [sessId]: {
        preview: tempMsg,
        rawMsg: tempMsg ? currentMsg : tempMsg,
      },
    });
  },
};
</script>

<style scoped lang="scss">
.action-panel {
  width: 100%;
  box-sizing: border-box;

  .input-panel {
    box-sizing: border-box;
    background: $bg-white-color;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    position: relative;

    .options-row {
      width: 100%;
      height: 47px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid $split-line-color;
      box-sizing: border-box;
      padding-left: 16px;

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
      font-size: 14px;
      overflow-y: auto;
      max-height: 200px;
      box-sizing: border-box;
      padding: 12px 0 12px 16px;

      .editor-container {
        width: 100%;
        height: 100%;
        min-height: 92px;
        line-height: 21px;
        font-size: 14px;
        border: none;
        outline: none;
        white-space: pre-line;
        word-break: break-all;

        &:empty::before {
          content: attr(placeholder);
          color: $tips-text-color;
          font-size: 14px;
        }

        ::v-deep .at-container {
          .at-tag {
            color: $primary-color;
            cursor: pointer;
          }
        }

        ::v-deep img {
          max-width: 120px;
          max-height: 120px;
        }
      }
    }
  }

  &.small-action {
    .options-row {
      height: 38px;
    }

    .input-textarea {
      min-height: 46px;
      max-height: 68px;

      .editor-container {
        min-height: 22px;
      }
    }
  }

  .at-member-panel {
    width: calc(100% - 32px);
    height: auto;
    max-height: 280px;
    display: flex;
    background: $bg-white-color;
    box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
    border-radius: 6px;
    border: 1px solid #eaeaea;
    overflow: hidden;
    position: absolute;
    z-index: 9;
    left: 16px;
    top: 40px;
    transform: translateY(-100%);
    padding-bottom: 6px;

    .scroll-view {
      flex: 1;
      padding: 0 6px;
      overflow-y: auto;
      margin-top: 6px;

      .member-item {
        height: 36px;
        background-color: $bg-white-color;
        border-radius: 6px;
        padding: 8px 12px 8px;
        display: flex;
        align-items: center;
        cursor: pointer;

        .img {
          display: block;
          width: 36px;
          height: 36px;
          border-radius: 4px;
        }

        .name {
          flex: 1;
          padding-left: 8px;
          font-size: 14px;
          color: $main-text-color;
        }

        &.active {
          background-color: $bg-hover-grey-color;
        }

        &:hover {
          background-color: $bg-hover-grey-color;
        }
      }

      .empty-tips,
      .tips {
        height: 40px;
        line-height: 40px;
        padding-left: 14px;
        background: $bg-white-color;
        font-size: 14px;
        color: $tips-text-color;
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
