<template>
  <div class="msg-card-item" :data-msg-id="msgId">
    <div
      class="card text"
      ref="MsgCard"
      :class="classObject"
      v-if="isText"
      v-html="msgText"
      v-contextMenu="[...textContextMenuList, ...baseContextMenuList]"
    ></div>

    <div
      class="card text"
      ref="MsgCard"
      :class="classObject"
      v-if="isAt"
      v-html="msgText"
      v-contextMenu="[...textContextMenuList, ...baseContextMenuList]"
    ></div>

    <div
      class="card text"
      ref="MsgCard"
      :class="classObject"
      v-if="isRevoke"
      v-html="msgText"
    ></div>

    <div
      class="wrap img"
      v-if="isImage"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...wrapStyle,
      }"
      v-contextMenu="[...imageContextMenuList, ...baseContextMenuList]"
    >
      <img :src="assetsPath" @click="handlePreview" />
    </div>

    <div
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_VIDEO"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
        ...wrapStyle,
      }"
      v-contextMenu="[...fileContextMenuList, ...baseContextMenuList]"
    >
      <video
        class="video-js vjs-big-play-centered vjs-fluid"
        ref="Video"
      ></video>
    </div>

    <audio
      class="wrap"
      :style="{
        width: `${size.width}px`,
        ...wrapStyle,
      }"
      v-if="msgType === CHECK_MSG_TYPE.IS_AUDIO"
      controls
      controlsList="nodownload noplaybackrate"
      preload="auto"
      :src="assetsPath"
      v-contextMenu="[...fileContextMenuList, ...baseContextMenuList]"
    ></audio>

    <div
      class="wrap file card"
      :class="classObject"
      :style="{ ...wrapStyle, ...wrapFileStyle }"
      v-if="isFile"
      v-contextMenu="[...fileContextMenuList, ...baseContextMenuList]"
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
  NETWORK_CALL_TYPE,
  SESSION_BUBBLE_MODEL,
  secondToDate,
  MsgCardMixins,
} from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import { mapGetters } from 'vuex';

export default {
  name: 'Msg-card',
  props: {
    rawMsg: {
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
  mixins: [MsgCardMixins],
  data() {
    return {
      NETWORK_CALL_TYPE,
      SESSION_BUBBLE_MODEL,
      imageMaxWidth: 500,
      wrapStyle: {
        maxWidth: '500px',
        maxHeight: '500px',
      },
      wrapFileStyle: {
        width: '340px',
      },
    };
  },
  computed: {
    ...mapGetters('IMStore', ['refreshRevoke', 'refreshReceipt']),

    classObject() {
      return {
        self: this.isSelf,
        target: !this.isSelf,
        disabled: this.isRevoke,
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
    refreshRevoke: {
      deep: true,
      handler(val) {
        if (!val?.msgId) return;
        if (val?.msgId === this.msg?.msgId) {
          this.msg = val;
        }
      },
    },
    refreshReceipt: {
      deep: true,
      handler(val) {
        const targetList = val?.filter((d) => d.msgId === this.msgId);
        if (!targetList.length) return;
        this.callbackReceiptUserList = targetList.map((d) => d.userId);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initSize(this.imViewWidth);
    });
  },
  methods: {
    initSize(imViewWidth) {
      if (!this.isImage && !this.isVideo && !this.isAudio && !this.isFile)
        return;
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
.msg-card-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  position: relative;

  .card {
    padding: 15px;

    &.self {
      background-color: $bubble-self-color;
    }

    &.target {
      background-color: $bubble-target-color;
    }

    &.text {
      user-select: text;
      word-break: break-all;
      white-space: pre-line;

      ::v-deep .at-tag {
        color: $primary-color;
        cursor: pointer;

        &.at-me {
          background-color: $primary-color;
          color: $bg-white-color;
          padding: 0px 4px;
          border-radius: 4px;
        }

        .at-tag-sup {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: $bg-white-color;
          border: 1px solid $tips-text-color;
          display: inline-block;
          margin-left: 2px;
          box-sizing: border-box;
          transform: translateY(-2px);

          &.read {
            background-color: $tips-text-color;
          }
        }
      }

      &.disabled {
        color: $minor-text-color;
      }

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

  audio {
    background: #f1f3f4 !important;
    max-width: 300px !important;
  }
}
</style>
