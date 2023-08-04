import { renderProcess } from '@lanshu/render-process';
import { IMRevokeMessage } from '@lanshu/im';
import { mapGetters } from 'vuex';
import lodash from 'lodash';
import dayjs from 'dayjs';
import { CHECK_MSG_TYPE, MSG_FORMAT_MAP } from '../msgUtils';
import { dataURLtoBlob, getFileSize } from '../base';
import { getAtTagList, formatAtTag, openAtUser } from '../atUtils';

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
          handler: this.handleCopy,
          icon: () => 'ls-icon-fuzhi',
        },
      ],
      imageContextMenuList: [
        {
          label: () => '复制',
          handler: this.handleCopyImage,
          icon: () => 'ls-icon-fuzhi',
          hide: () => {
            return this.assetsPath.includes('gif');
          },
        },
        {
          label: () => '另存为',
          handler: this.handleDownFile,
          icon: () => 'ls-icon-xiazai',
        },
      ],
      fileContextMenuList: [
        {
          label: () => '另存为',
          handler: this.handleDownFile,
          icon: () => 'ls-icon-xiazai',
        },
      ],
      msg: {},
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
          msgText = msgText.replace(d, `#_&_#LINK#_&_#`);
        });
        msgText = msgText
          .split('#_&_#')
          .filter((d) => d && d !== ' ')
          .map((d) => {
            if (d === 'LINK') {
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
    size() {
      if (!this.isImage && !this.isVideo && !this.isAudio) return;
      const { wide, high } = this.msgData;
      const ratio = high ? wide / high : 1;
      if (wide > high && wide >= this.imageMaxWidth) {
        return {
          width: this.imageMaxWidth,
          height: this.imageMaxWidth / ratio,
        };
      } else if (high > wide && high >= this.imageMaxWidth) {
        return {
          width: this.imageMaxWidth * ratio,
          height: this.imageMaxWidth,
        };
      }
      return {
        width: wide || this.imageMaxWidth,
        height: high || this.imageMaxWidth,
      };
    },
  },

  created() {
    this.msg = this.rawMsg;
    // 给动态生成的html标签绑定事件，挂载到window上;
    window.openTargetUrl = this.openTargetUrl;
    window.openAtUser = (event) => openAtUser(this, event);
  },

  mounted() {
    this.getAssetsPath().catch(() => {});
    this.$nextTick(() => {
      if (!this.isVideo) return;
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
              src: this.msgData.videoUrl,
              type: this.msgData.type,
              poster: this.msgData?.snapshotUrl,
            },
          ],
        },
        function () {
          console.log('视频可以播放了', this);
        },
      );
    });
  },

  methods: {
    getFileSize,

    openTargetUrl(event) {
      const url = event.target.getAttribute('data-url');
      if (!url) return;
      renderProcess.openUrl(url);
    },

    async handleDownload() {
      const msgId = this.msgId;
      const type = this.assetsPath.split('/').pop().split('.')[1];
      await this.handleSaveFile(`cache_${msgId}`, this.assetsPath, msgId);
      const cachePath = await renderProcess.getCacheFilePath(
        `${msgId}.${type}`,
      );
      this.cachePath = cachePath;
    },

    async handleSaveFile(key, url, fileName) {
      await renderProcess.saveCacheFile({
        url,
        fileName,
      });
      await window.$lanshuStore.setItem(key, url);
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
        const msgId = this.msgId || `${this.msg?.cliMsgId}_${Date.now()}`;
        const key = `cache_${msgId}`;
        const storePath = (await window.$lanshuStore.getItem(key)) || '';
        // 未产生缓存
        if (!storePath) {
          if (this.msgType !== this.CHECK_MSG_TYPE.IS_FILE) {
            this.handleSaveFile(key, assetsPath, msgId).then(() => {
              console.log('文件缓存下载成功');
            });
          }
        } else {
          const type = assetsPath.split('/').pop().split('.')[1];
          const cachePath = await renderProcess.getCacheFilePath(
            `${msgId}.${type}`,
          );
          // 本地缓存文件存在
          if (cachePath) {
            assetsPath = cachePath;
            this.cachePath = cachePath;
          } else {
            // 本地缓存文件不存在，意外删除，重新下载并缓存
            this.handleSaveFile(key, assetsPath, msgId).then(() => {
              console.log('文件缓存下载成功');
            });
          }
        }
      }
      this.assetsPath = assetsPath;
    },

    async handleCopy() {
      this.selectedText = window.getSelection().toString();
      const text = this.selectedText || this.$refs.MsgCard.innerText;
      await navigator.clipboard.writeText(text);
      this.$message.success('复制成功');
    },

    async handleCopyImage() {
      if (!this.cachePath) {
        await this.handleDownload();
      }
      console.log(this.cachePath);
      const base64 = await renderProcess.getCacheFile2Base64(this.cachePath);
      const blob = dataURLtoBlob(base64);

      setTimeout(async () => {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        this.$message.success('复制成功');
      }, 100);
    },

    async handleDownFile() {
      if (!this.cachePath) {
        await this.handleDownload();
      }
      const dirPath = await renderProcess.saveFileDialog(
        `${dayjs().format('YYYYMMDDHHmmss')}.${
          this.assetsPath.split('/').pop().split('.')[1]
        }`,
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
  },
};
