<template>
  <div class="history-msg-card">
    <div
      class="text"
      v-if="msgType === CHECK_MSG_TYPE.IS_TEXT"
      v-html="text"
    ></div>

    <div
      class="wrap"
      style="cursor: pointer"
      v-if="isImage"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
      @click="handlePreview"
    >
      <img :src="assetsPath" />
    </div>

    <div
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_VIDEO"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
    >
      <video
        playsinline
        controls
        preload="auto"
        poster
        :src="assetsPath"
      ></video>
    </div>

    <div class="wrap" v-if="msgType === CHECK_MSG_TYPE.IS_AUDIO">
      <audio class="audio" controls preload="auto" :src="assetsPath"></audio>
    </div>

    <div class="wrap file" v-if="msgType === CHECK_MSG_TYPE.IS_FILE">
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
  </div>
</template>

<script>
import {
  CHECK_MSG_TYPE,
  MSG_FORMAT_MAP,
  getFileSize,
  downloadFile,
} from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'History-msg-card',
  props: {
    msg: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      CHECK_MSG_TYPE,
      MSG_FORMAT_MAP,
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
      console.log(wide, high, ratio);
      if (wide > high && wide >= 210) {
        return {
          width: 210,
          height: 210 / ratio,
        };
      } else if (high > wide && high >= 210) {
        return {
          width: 210 * ratio,
          height: 210,
        };
      }
      return {
        width: wide || 210,
        height: high || 210,
      };
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
      renderProcess.showItemInFolder(this.cachePath.replace('cache:///', ''));
    },

    async handlePreview() {
      if (!this.assetsPath.includes('cache')) {
        await this.handleDownload()
      }
      renderProcess.previewAssets(this.cachePath.replace('cache:///', ''))
    }
  },
};
</script>

<style scoped lang="scss">
.history-msg-card {
  .text {
    user-select: text;
    word-break: break-all;
  }

  .wrap {
    overflow: hidden;
    max-height: 210px;
    max-width: 210px;
    margin-top: 6px;
    border-radius: 6px;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }

    video {
      width: 100%;
      height: 100%;
      display: block;
    }

    audio {
      width: 210px;
      height: 30px;
      display: block;
    }

    &.file {
      width: 210px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color: $bg-hover-grey-color;

      .view {
        width: 46px;
        height: 46px;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        align-content: center;
        justify-content: center;

        .tag {
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
        }
      }

      .info {
        flex: 1;
        height: 36px;
        padding-right: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .name {
          flex: 1;
          max-width: 120px;
          height: 20px;
          font-size: 12px;
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

      .close-btn {
        cursor: pointer;
        font-size: 12px;
        color: $primary-color;
        margin-right: 16px;
      }
    }
  }
}
</style>
