<template>
  <div class="msg-card">
    <div
      class="card text"
      ref="MsgCard"
      :class="classObject"
      v-if="isText"
      v-html="msgText"
      v-contextMenu="textContextMenuList"
    ></div>

    <div
      class="wrap img"
      v-if="isImage"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...wrapStyle,
      }"
      v-contextMenu="imageContextMenuList"
    >
      <img :src="assetsPath" @click="handlePreview" />
    </div>

    <video
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_VIDEO"
      playsinline
      controls
      preload="auto"
      poster
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...wrapStyle,
      }"
      :src="assetsPath"
    ></video>

    <audio
      class="wrap"
      :style="wrapStyle"
      v-if="msgType === CHECK_MSG_TYPE.IS_AUDIO"
      controls
      preload="auto"
      :src="assetsPath"
    ></audio>

    <div
      class="wrap file card"
      :class="classObject"
      :style="{ ...wrapStyle, ...wrapFileStyle }"
      v-if="isFile"
    >
      <div class="view">
        <LsIcon
          class="audio-icon"
          icon="ls-icon-icon_wenjian1"
          render-svg
          width="31"
          height="33"
        ></LsIcon>
      </div>
      <div class="info">
        <span class="name">{{ msgData.name }}</span>
        <span class="tips">
          <span>{{ getFileSize(msgData.size) }}</span>

          <span class="btn-list">
            <span class="opt-btn" v-if="cachePath">
              <el-tooltip
                class="item"
                effect="dark"
                content="查看文件夹"
                placement="top"
              >
                <LsIcon
                  class="audio-icon"
                  icon="ls-icon-icon_wenjianjia"
                  render-svg
                  width="14"
                  height="14"
                  @click="handleOpenDir"
                ></LsIcon>
              </el-tooltip>
            </span>
            <span class="opt-btn" v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="top"
              >
                <LsIcon
                  class="audio-icon"
                  icon="ls-icon-icon_xiazai"
                  render-svg
                  width="14"
                  height="14"
                  @click="handleDownload"
                ></LsIcon>
              </el-tooltip>
            </span>
          </span>
        </span>
      </div>
    </div>

    <div
      class="card text"
      :class="classObject"
      v-if="msgType === CHECK_MSG_TYPE.IS_TRTC"
    >
      <LsIcon
        v-if="!isSelf || bubbleModel === SESSION_BUBBLE_MODEL.IS_LEFT"
        class="trtc-icon target"
        :class="classObject"
        :icon="`${
          msgData.type === NETWORK_CALL_TYPE.IS_VIDEO
            ? 'ls-icon-icon_shipin_duifang'
            : 'ls-icon-icon_duihuakuang_yuyin'
        }`"
        width="18"
        height="18"
      ></LsIcon>
      {{ trtcMsgTips }}
      <LsIcon
        v-if="isSelf && bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN"
        class="trtc-icon self"
        :icon="`${
          msgData.type === NETWORK_CALL_TYPE.IS_VIDEO
            ? 'ls-icon-icon_shipin_wo'
            : 'ls-icon-icon_duihuakuang_yuyin'
        }`"
        width="18"
        height="18"
      ></LsIcon>
    </div>
  </div>
</template>

<script>
import {
  MSG_FORMAT_MAP,
  CHECK_MSG_TYPE,
  getFileSize,
  NETWORK_CALL_TYPE,
  SESSION_BUBBLE_MODEL,
  lodash,
  secondToDate,
  dataURLtoBlob,
} from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'Msg-card',
  props: {
    msg: {
      type: Object,
      required: true,
      default: () => {},
    },
    isSelf: {
      type: Boolean,
      required: true,
      default: true,
    },
    bubbleModel: {
      type: [Number, String],
      default: SESSION_BUBBLE_MODEL.IS_BETWEEN,
    },
    imViewWidth: {
      type: [Number, String],
      required: true,
      default: 500,
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      NETWORK_CALL_TYPE,
      SESSION_BUBBLE_MODEL,
      MSG_FORMAT_MAP,
      CHECK_MSG_TYPE,
      assetsPath: '',
      cachePath: '',
      selectedText: '',
      imageMaxWidth: 500,
      wrapStyle: {
        maxWidth: '500px',
        maxHeight: '500px',
      },
      wrapFileStyle: {
        width: '340px',
      },

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
            return this.assetsPath.includes('gif') ? true : false;
          },
        },
        {
          label: () => '另存为',
          handler: this.handleDownImage,
          icon: () => 'ls-icon-xiazai',
        },
      ],
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
    classObject() {
      return {
        self: this.isSelf,
        target: !this.isSelf,
      };
    },
    trtcMsgTips() {
      const msgType = this.msg?.msgType;
      const tipsMap = {
        671: `通话结束 ${secondToDate(this.msgData?.time)}`,
        672: `${this.isSelf ? '' : '对方'}已拒绝`,
        673: `${this.isSelf ? '' : '对方'}已取消`,
        674: `${this.isSelf ? '对方无' : '未'}应答`,
      };
      return tipsMap[msgType];
    },
  },
  watch: {
    imViewWidth(val) {
      this.initSize(val);
    },
  },
  mounted() {
    this.getAssetsPath();

    this.$nextTick(() => {
      this.initSize(this.imViewWidth);

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

    initSize(imViewWidth) {
      if (!this.isImage && !this.isVideo && !this.isFile) return;
      if (imViewWidth <= 490) {
        this.imageMaxWidth = 210;
        this.wrapStyle = { maxWidth: '210px', maxHeight: '210px' };
        this.wrapFileStyle = { width: '210px' };
      } else if (imViewWidth < 738 && imViewWidth > 380) {
        this.imageMaxWidth = 300;
        this.wrapStyle = { maxWidth: '300px', maxHeight: '300px' };
        this.wrapFileStyle = { width: '300px' };
      } else {
        this.imageMaxWidth = 500;
        this.wrapStyle = { maxWidth: '500px', maxHeight: '500px' };
        this.wrapFileStyle = { width: '340px' };
      }
    },
  },
};
</script>

<style scoped lang="scss">
.msg-card {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  position: relative;

  .card {
    padding: 15px;

    &.self {
      background-color: $bubble-IM-color;
    }

    &.target {
      background-color: $bg-white-color;
    }

    &.text {
      user-select: text;
      word-break: break-all;

      ::v-deep .link-jump {
        color: $primary-color;
        cursor: pointer;
      }

      .trtc-icon {
        &.self {
          margin-left: 9px;
        }

        &.target {
          margin-right: 9px;
        }
      }
    }
  }

  .wrap {
    display: block;

    &.img {
      cursor: pointer;
      background: $bg-white-color;
      position: relative;
      border: 1px solid $split-line-color;

      &:before {
        content: '图片加载中...';
        z-index: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: $tips-text-color;
      }

      img {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
      }
    }

    &.file {
      width: 340px;
      height: 70px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      //background: $bg-white-color;

      .view {
        width: 31px;
        height: 40px;
        display: flex;
        align-items: center;
        margin-right: 12px;
        overflow: hidden;

        .tag {
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
        }
      }

      .info {
        flex: 1;
        height: 40px;
        max-width: calc(100% - 41px);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .name {
          flex: 1;
          max-width: 85%;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: $main-text-color;
          font-weight: bold;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tips {
          color: $minor-text-color;
          font-size: 12px;
          width: 100%;
          height: 17px;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .btn-list {
            cursor: pointer;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .opt-btn {
              width: 26px;
              height: 26px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;

              &:last-child {
                margin: 2px 0 0px 10px;
              }

              &:hover {
                background: $bg-hover-grey-color;
              }
            }
          }
        }
      }
    }
  }
}
</style>
