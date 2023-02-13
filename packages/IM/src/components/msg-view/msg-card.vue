<template>
  <div class="msg-card">
    <div
      class="card text"
      :class="classObject"
      v-if="msgType === checkMsgType.isText"
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
      v-if="msgType === checkMsgType.isVideo"
      playsinline
      controls
      preload="auto"
      poster
      :src="assetsPath"
    ></video>

    <audio
      class="wrap"
      v-if="msgType === checkMsgType.isAudio"
      controls
      preload="auto"
      width="300"
      height="100"
      :src="assetsPath"
    ></audio>

    <div
      class="wrap file card"
      :class="classObject"
      v-if="msgType === checkMsgType.isFile"
    >
      <div class="view">
        <LsIcon
          class="audio-icon"
          icon="icon_wenjian"
          render-svg
          width="46"
          height="46"
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
import { msgTypeMap, checkMsgType, getFileSize, downloadFile } from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';

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
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      msgTypeMap,
      checkMsgType,
    };
  },
  computed: {
    msgType() {
      const msgType = this.msg?.msgType;
      return this.msgTypeMap[msgType].type;
    },
    msgData() {
      return this.msg?.data || {};
    },

    text() {
      return this.msgData?.content;
    },
    isImage() {
      return this.msgType === this.checkMsgType.isImage;
    },
    assetsPath() {
      return this.msgData?.url || this.msgData?.videoUrl;
    },
    size() {
      if (!this.isImage) return;
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
  },
  mounted() {},
  methods: {
    getFileSize,
    handleDownload() {
      downloadFile(this.assetsPath, this.msgData.name)
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
    }
  }

  .wrap {
    display: block;
    max-height: 500px;
    max-width: 500px;

    &.file {
      width: 358px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .view {
        width: 46px;
        height: 46px;
        margin-right: 16px;
        border-radius: 6px;
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
        height: 48px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .name {
          flex: 1;
          max-width: 250px;
          height: 22px;
          line-height: 22px;
          font-size: 16px;
          color: $main-text-color;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tips {
          color: $minor-text-color;
          font-size: 14px;
        }
      }

      .close-btn {
        cursor: pointer;
        color: $primary-color;
        margin-right: 16px;
      }
    }
  }
}
</style>
