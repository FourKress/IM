import { renderProcess } from '@lanshu/render-process';
import { IMRevokeMessage } from '@lanshu/im';
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import lodash from 'lodash';
import { microShared } from '@lanshu/micro';

import {
  MICRO_EVENT_IPC,
  MICRO_NAME_CONFIG,
  PLACEHOLDER_CONFIG,
} from '../constant';
import { CHECK_MSG_TYPE, MSG_FORMAT_MAP } from '../msgUtils';
import { dataURLtoBlob, getFileSize } from '../base';
import {
  getAtTagList,
  formatAtTag,
  formatCardAtTag,
  openAtUser,
} from '../atUtils';

export default {
  data() {
    return {
      CHECK_MSG_TYPE,
      MSG_FORMAT_MAP,
      assetsPath: '',
      cachePath: '',
      selectedText: '',
      baseContextMenuList: [
        {
          label: () => '撤回',
          handler: this.handleRevokeMessage,
          icon: () => 'ls-icon-caozuojilu',
          hide: () => {
            return !this.isSelf && this.msgId;
          },
        },
      ],
      textContextMenuList: [
        {
          label: () => '复制',
          handler: this.handleCopyText,
          icon: () => 'ls-icon-fuzhi',
        },
      ],
      positionContextMenuList: [
        {
          label: () => '复制',
          handler: this.handleCopyPosition,
          icon: () => 'ls-icon-fuzhi',
        },
      ],
      fileContextMenuList: [
        {
          label: () => '复制',
          handler: this.handleCopyFile,
          icon: () => 'ls-icon-fuzhi',
        },
        {
          label: () => '另存为',
          handler: this.handleDownFile,
          icon: () => 'ls-icon-xiazai',
        },
      ],
      msg: {},
      videoLoading: true,
    };
  },

  computed: {
    ...mapGetters('IMStore', ['userInfo']),

    msgId() {
      return this.msg?.msgId;
    },
    msgType() {
      const msgType = this.msg?.msgType;
      return this.MSG_FORMAT_MAP[msgType].type;
    },
    msgData() {
      return this.msg?.data || {};
    },
    cardElements() {
      return this.msg?.data.elements || [];
    },
    cardTextList() {
      return this.cardElements
        .filter((d) => d.m_type === 'text')
        ?.map((d) => {
          let text = d.text;
          const atArr = getAtTagList(text);
          if (atArr.length) {
            text = formatCardAtTag(
              {
                ...this.msg,
                data: {
                  content: text,
                },
              },
              atArr,
            );
          }
          return text;
        });
    },
    cardBtnEleList() {
      return this.cardElements.filter((d) => d.m_type === 'buttons');
    },
    cardHeader() {
      return this.msg?.data.header || null;
    },
    linkArr() {
      const content = this.msgData?.content;
      if (!this.isText || !content) return [];
      const reg = /http(s)?:\/\/\S+(?<=[a-zA-Z])/g;
      const matchArr = content.match(reg) || [];
      let linkArr = [];
      matchArr.forEach((d) => {
        linkArr.push(...d.split(/&nbsp;|<br>|\n/).filter((c) => reg.test(c)));
      });
      return linkArr?.length ? linkArr : [];
    },
    atArr() {
      const content = this.msgData?.content;
      if (!this.isAt || !content) return [];
      return getAtTagList(content);
    },
    msgText() {
      const content = this.msgData?.content;
      const linkArr = lodash.cloneDeep(this.linkArr);
      const atArr = lodash.cloneDeep(this.atArr);
      let msgText = content;
      if (linkArr.length) {
        linkArr.forEach((d) => {
          msgText = msgText.replace(
            d,
            `${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}${PLACEHOLDER_CONFIG.LINK_SEPARATOR}${PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR}`,
          );
        });
        msgText = msgText
          .split(PLACEHOLDER_CONFIG.MSG_TAG_SEPARATOR)
          .filter((d) => d && d !== ' ')
          .map((d) => {
            if (d === PLACEHOLDER_CONFIG.LINK_SEPARATOR) {
              const url = linkArr.splice(0, 1)[0];
              d = `<span class="link-jump" data-url="${url}" onclick="openTargetUrl(event)">${url}</span>`;
            }
            return d;
          })
          .join('');
      }
      if (atArr.length) {
        msgText = formatAtTag(this.msg, atArr);
      }
      return msgText;
    },
    isAt() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_AT;
    },
    isRevoke() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_REVOKE;
    },
    isText() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_TEXT;
    },
    isImage() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_IMAGE;
    },
    isVideo() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_VIDEO;
    },
    isAudio() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_AUDIO;
    },
    isFile() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_FILE;
    },
    isPosition() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_POSITION;
    },
    isCard() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_CARD;
    },
    size() {
      if (!this.isImage && !this.isVideo && !this.isAudio) return;
      const { wide, high } = this.msgData;
      const ratio = high ? wide / high : 1;
      let width = Math.max(wide, 187);
      let height = width / ratio;
      if (width > height && width >= this.imageMaxWidth) {
        return {
          width: this.imageMaxWidth,
          height: this.imageMaxWidth / ratio,
        };
      } else if (height > width && height >= this.imageMaxWidth) {
        return {
          width: this.imageMaxWidth * ratio,
          height: this.imageMaxWidth,
        };
      }
      return {
        width: width || this.imageMaxWidth,
        height: height || this.imageMaxWidth,
      };
    },
  },

  watch: {
    cachePath(val) {
      if (val) {
        this.initVideoPlay();
      }
    },
  },

  created() {
    this.msg = this.rawMsg;
    // 给动态生成的html标签绑定事件，挂载到window上;
    window.openTargetUrl = this.openTargetUrl;
    window.openAtUser = (event) => openAtUser(this, event);
  },

  async mounted() {
    await this.getAssetsPath();
  },

  methods: {
    getFileSize,

    getFileType(assetsPath = this.assetsPath) {
      return assetsPath.split('/').pop().split('.')[1];
    },
    getFileName() {
      const { cliMsgId, toUser } = this.msg;
      return `${toUser}_${cliMsgId}`;
    },

    openTargetUrl(event) {
      const url = event.target.getAttribute('data-url');
      if (!url) return;
      renderProcess.openUrl(url);
    },

    async handleDownload() {
      const fileName = this.getFileName();
      await this.handleSaveFile(`cache_${fileName}`, this.assetsPath, fileName);
      await this.setCachePath(this.assetsPath);
    },

    async setCachePath(filePath) {
      const fileName = this.getFileName();
      const type = this.getFileType(filePath);
      const cachePath = await renderProcess.getCacheFilePath(
        `${fileName}.${type}`,
      );
      this.cachePath = cachePath;
    },

    async handleSaveFile(key, url, fileName) {
      await renderProcess.saveCacheFile({
        url,
        fileName,
      });
      await window.$lanshuStore.setItem(key, url);
      await this.setCachePath(url);
    },

    handleOpenDir() {
      renderProcess.showItemInFolder(this.cachePath);
    },

    async handlePreview() {
      if (!this.cachePath) {
        await this.handleDownload();
      }
      renderProcess.previewAssets(this.cachePath);
    },

    async getAssetsPath() {
      let assetsPath = this.msgData?.url || this.msgData?.videoUrl;
      if (assetsPath) {
        const fileName = this.getFileName();
        const key = `cache_${fileName}`;
        const storePath = (await window.$lanshuStore.getItem(key)) || '';
        // 未产生缓存
        if (!storePath) {
          if (this.msgType !== this.CHECK_MSG_TYPE.IS_FILE) {
            this.handleSaveFile(key, assetsPath, fileName).then(() => {
              console.log('文件缓存下载成功 1');
            });
          }
        } else {
          const type = this.getFileType(assetsPath);
          const cachePath = await renderProcess.getCacheFilePath(
            `${fileName}.${type}`,
          );
          // 本地缓存文件存在
          if (cachePath) {
            assetsPath = cachePath;
            this.cachePath = cachePath;
          } else {
            // 本地缓存文件不存在，意外删除，重新下载并缓存
            this.handleSaveFile(key, assetsPath, fileName).then(() => {
              console.log('文件缓存下载成功 2');
            });
          }
        }
      }
      this.assetsPath = assetsPath;
    },

    async handleCopyText() {
      this.selectedText = window.getSelection().toString();
      const text = this.selectedText || this.$refs.MsgCard.innerText;
      await navigator.clipboard.writeText(text);
      this.$message.success('复制成功');
    },

    async handleCopyPosition() {
      microShared.EventIPC(MICRO_NAME_CONFIG.SMART_ADVOCACY, {
        type: MICRO_EVENT_IPC.POSITION_INFO,
        value: {
          ...this.msgData,
        },
      });
    },

    async handleCopyFile() {
      if (!this.cachePath) {
        await this.handleDownload();
      }
      const { type, name = '' } = this.msgData;

      const base64 = await renderProcess.getCacheFile2Base64(
        this.cachePath,
        type,
      );

      let fileType = `${type}${
        PLACEHOLDER_CONFIG.FILE_NAME_SEPARATOR
      }${this.getFileName()}.${this.getFileType()}`;
      if (name) {
        fileType += `${PLACEHOLDER_CONFIG.RAW_NAME_SEPARATOR}${name}`;
      }
      const blob = dataURLtoBlob(base64, fileType);

      await navigator.clipboard.write([
        new ClipboardItem({
          [`${PLACEHOLDER_CONFIG.CUSTOM_PROTOCOL}${blob.type}`]: blob,
        }),
      ]);
      this.$message.success('复制成功');
    },

    async handleDownFile() {
      if (!this.cachePath) {
        await this.handleDownload();
      }
      const dirPath = await renderProcess.saveFileDialog(
        `${dayjs().format('YYYYMMDDHHmmss')}.${this.getFileType()}`,
      );
      if (!dirPath) {
        typeof dirPath === 'Boolean' &&
          this.$message.warning('请选择保存文件夹');
        return;
      }
      await renderProcess.copyFile(this.cachePath, dirPath);
      this.$message.success('保存成功');
    },

    async handleRevokeMessage() {
      const msgId = this.msgId;
      if (!msgId) return;
      await IMRevokeMessage(msgId);
    },

    initVideoPlay() {
      this.$nextTick(async () => {
        if (!this.isVideo || !this.cachePath) return;
        this.videoLoading = false;
        this.$Video(
          this.$refs.Video,
          {
            controls: true,
            poster: this.msgData?.snapshotUrl,
            preload: 'auto',
            autoplay: false,
            fluid: true,
            muted: false,
            inactivityTimeout: false,
            noUITitleAttributes: true,
            controlBar: {
              children: [
                { name: 'playToggle' },
                { name: 'progressControl' },
                { name: 'remainingTimeDisplay', displayNegative: false },
                {
                  name: 'volumePanel',
                  inline: false,
                },
              ],
            },
            sources: [
              // 视频源
              {
                src: this.cachePath || this.assetsPath,
                type: this.msgData.type,
                poster: this.msgData?.snapshotUrl,
              },
            ],
          },
          function () {
            console.log('视频可以播放了');
          },
        );
      });
    },
  },
};
