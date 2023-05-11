<template>
  <div class="history-msg-card">
    <div class="text" v-if="msgType === CHECK_MSG_TYPE.IS_TEXT">
      {{ text }}
    </div>

    <div
      class="wrap"
      v-if="isImage"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
    >
      <img :src="assetsPath" />
    </div>

    <div class="wrap" v-if="msgType === CHECK_MSG_TYPE.IS_VIDEO">
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
          icon="icon_wenjian"
          render-svg
          width="32"
          height="32"
        ></LsIcon>
      </div>
      <div class="info">
        <span class="name">{{ msgData.name }}</span>
        <span class="tips">{{ getFileSize(msgData.size) }}</span>
      </div>
      <div class="close-btn" @click="handleDownload">下载</div>
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
    assetsPath() {
      return this.msgData?.url || this.msgData?.videoUrl;
    },
    size() {
      if (!this.isImage) return;

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
  methods: {
    getFileSize,
    handleDownload() {
      downloadFile(this.assetsPath, this.msgData.name);
    },
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
      background-color: #bcd7ff;

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
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .name {
          flex: 1;
          max-width: 100px;
          height: 20px;
          font-size: 12px;
          color: $main-text-color;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tips {
          color: $minor-text-color;
          font-size: 12px;
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
