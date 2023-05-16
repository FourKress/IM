<template>
  <div class="msg-card">
    <div
      class="card text"
      :class="classObject"
      v-if="msgType === CHECK_MSG_TYPE.IS_TEXT"
    >
      {{ text }}
    </div>
    <img
      class="wrap"
      v-if="isImage"
      :width="size.width"
      :height="size.height"
      :src="assetsPath"
    />
    <video
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_VIDEO"
      playsinline
      controls
      preload="auto"
      poster
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
      :src="assetsPath"
    ></video>

    <audio
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_AUDIO"
      controls
      preload="auto"
      :src="assetsPath"
    ></audio>

    <div
      class="wrap file card"
      :class="classObject"
      v-if="msgType === CHECK_MSG_TYPE.IS_FILE"
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
  downloadFile,
  NETWORK_CALL_TYPE,
  SESSION_BUBBLE_MODEL,
} from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';
import {showItemInFolder} from "@lanshu/render-process/src/renderProcess";

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
      type: Number,
      default: SESSION_BUBBLE_MODEL.IS_BETWEEN,
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

    text() {
      return this.msgData?.content;
    },
    isImage() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_IMAGE;
    },
    isVideo() {
      return this.msgType === this.CHECK_MSG_TYPE.IS_VIDEO;
    },
    size() {
      if (!this.isImage && !this.isVideo) return;
      const { wide, high } = this.msgData;
      const ratio = high ? wide / high : 1;
      if (wide > high && wide >= 500) {
        return {
          width: 500,
          height: 500 / ratio,
        };
      } else if (high > wide && high >= 500) {
        return {
          width: 500 * ratio,
          height: 500,
        };
      }
      return {
        width: wide || 500,
        height: high || 500,
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
        671: `通话结束 ${this.secondToDate(this.msgData?.time)}`,
        672: `${this.isSelf ? '' : '对方'}已拒绝`,
        673: `${this.isSelf ? '' : '对方'}已取消`,
        674: `${this.isSelf ? '对方无' : '未'}应答`,
      };
      return tipsMap[msgType];
    },
  },
  mounted() {
    this.getAssetsPath();
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
    //秒转化成 时分秒
    secondToDate(time) {
      if (!time) return '';
      const h = Math.floor(time / 3600);
      const m = Math.floor((time / 60) % 60);
      const s = Math.floor(time % 60);
      if (h) {
        return `${this.formatTime(h)}:${this.formatTime(m)}:${this.formatTime(
          s,
        )}`;
      }
      return `${this.formatTime(m)}:${this.formatTime(s)}`;
    },
    formatTime(time) {
      return time < 10 ? `0${time}` : time;
    },

    async getAssetsPath() {
      let assetsPath = this.msgData?.url || this.msgData?.videoUrl;
      if (assetsPath) {
        const msgId = this.msg?.msgId;
        const key = `cache_${msgId}`;
        const storePath = (await window.$lanshuStore.getItem(key)) || '';
        console.log(storePath, msgId);
        // 未产生缓存
        if (!storePath) {
          if (this.msgType !== this.CHECK_MSG_TYPE.IS_FILE) {
            await this.handleSaveFile(key, assetsPath, msgId);
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
            await this.handleSaveFile(key, assetsPath, msgId);
          }
          console.log('assetsPath', assetsPath);
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
      console.log(this.cachePath);
      renderProcess.showItemInFolder(this.cachePath.replace('cache:///', ''))
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
      display: flex;
      align-items: center;

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
    max-height: 500px;
    max-width: 500px;

    &.file {
      width: 340px;
      height: 70px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background: $bg-white-color;

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
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .name {
          flex: 1;
          max-width: 200px;
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
