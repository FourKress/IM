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
      :src="assetsPath"
    ></video>

    <audio
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_AUDIO"
      controls
      preload="auto"
      width="300"
      height="100"
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

    <div
      class="card text"
      :class="classObject"
      v-if="msgType === CHECK_MSG_TYPE.IS_TRTC"
    >
      <LsIcon
        v-if="!isSelf || (bubbleModel === SESSION_BUBBLE_MODEL.IS_LEFT)"
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
        v-if="isSelf && (bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN)"
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
    }
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
  mounted() {},
  methods: {
    getFileSize,
    handleDownload() {
      downloadFile(this.assetsPath, this.msgData.name);
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
