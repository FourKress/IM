import { CHECK_MSG_TYPE, MSG_FORMAT_MAP } from '../constant';
import { dataURLtoBlob, getFileSize, lodash } from '../../lib/main';
import { renderProcess } from '@lanshu/render-process';
import { IMRevokeMessage } from '@lanshu/im';

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
          icon: () => 'ls-icon-fuzhi',
          hide: () => {
            return !this.isSelf && this.msg?.msgId;
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
          handler: this.handleDownImage,
          icon: () => 'ls-icon-xiazai',
        },
      ],
      msg: {},
    };
  },

  computed: {
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
      const reg = /http(s)?:\/\/\S+/g;
      const matchArr = content.match(reg) || [];
      let linkArr = [];
      matchArr.forEach((d) => {
        linkArr.push(...d.split(/&nbsp;|<br>|\n/).filter((c) => reg.test(c)));
      });
      return linkArr?.length ? linkArr : [];
    },
    msgText() {
      const content = this.msgData?.content;
      const linkArr = lodash.cloneDeep(this.linkArr);
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
              d = `<span class="link-jump link-jump_${this.msg.msgId}">${
                linkArr.splice(0, 1)[0]
              }</span>`;
            }
            return d;
          })
          .join('');
      }
      return msgText;
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
    isFile() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_FILE;
    },
    size() {
      if (!this.isImage && !this.isVideo) return;
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
  },

  mounted() {
    this.getAssetsPath();

    this.$nextTick(() => {
      if (this.linkArr.length) {
        const linKDomArr = [
          ...document.querySelectorAll(`.link-jump_${this.msg.msgId}`),
        ];
        linKDomArr.forEach((d) => {
          d.onclick = (e) => {
            const url = e.target.innerText;
            renderProcess.openUrl(url);
          };
        });
      }
    });
  },

  methods: {
    getFileSize,

    async handleDownload() {
      const msgId = this.msg?.msgId;
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
      if (!this.assetsPath.includes('cache')) {
        await this.handleDownload();
      }
      renderProcess.previewAssets(this.cachePath);
    },

    async getAssetsPath() {
      let assetsPath = this.msgData?.url || this.msgData?.videoUrl;
      if (assetsPath) {
        const msgId = this.msg?.msgId || `${this.msg?.cliMsgId}_${Date.now()}`;
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
      const base64 = await renderProcess.getCacheFile2Base64(this.cachePath);
      const blob = dataURLtoBlob(base64);

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      this.$message.success('复制成功');
    },

    async handleDownImage() {
      const dirPath = await renderProcess.saveFileDialog();
      if (!dirPath) {
        this.$message.warning('请选择保存文件夹');
        return;
      }
      await renderProcess.copyFile(this.cachePath, dirPath);
      this.$message.success('保存成功');
    },

    async handleRevokeMessage() {
      const { msgId } = this.msg;
      if (!msgId) return;
      await IMRevokeMessage(msgId);
      console.log(123);
    },
  },
};
