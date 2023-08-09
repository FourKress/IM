<template>
  <div class="history-msg-card">
    <div
      class="text"
      ref="MsgCard"
      v-if="msgType === CHECK_MSG_TYPE.IS_TEXT"
      v-html="msgText"
      v-contextMenu="textContextMenuList"
    ></div>

    <div
      class="wrap img"
      style="cursor: pointer"
      v-if="isImage"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
      v-contextMenu="imageContextMenuList"
    >
      <img :src="assetsPath" @click="handlePreview" />
    </div>

    <div
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_VIDEO"
      :style="{ width: `${size.width}px`, height: `${size.height}px` }"
      v-contextMenu="fileContextMenuList"
    >
      <video
        class="video-js vjs-big-play-centered vjs-fluid"
        ref="Video"
      ></video>
    </div>

    <div
      class="wrap"
      v-if="msgType === CHECK_MSG_TYPE.IS_AUDIO"
      v-contextMenu="fileContextMenuList"
    >
      <audio
        class="audio"
        controls
        controlsList="nodownload noplaybackrate"
        preload="auto"
        :src="assetsPath"
      ></audio>
    </div>

    <div
      class="wrap file"
      v-if="msgType === CHECK_MSG_TYPE.IS_FILE"
      v-contextMenu="fileContextMenuList"
    >
      <div class="view">
        <LsIcon
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
import { LsIcon } from '@lanshu/components';
import { MsgCardMixins } from '@lanshu/utils';

export default {
  name: 'History-msg-card',
  props: {
    rawMsg: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  components: {
    LsIcon,
  },
  mixins: [MsgCardMixins],
  data() {
    return {
      imageMaxWidth: 210,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.history-msg-card {
  .text {
    user-select: text;
    word-break: break-all;
    white-space: pre-line;

    ::v-deep .link-jump {
      color: $primary-color;
      cursor: pointer;
    }
  }

  .wrap {
    overflow: hidden;
    max-height: 210px;
    max-width: 210px;
    margin-top: 6px;
    border-radius: 6px;

    &.img {
      border: 1px solid $split-line-color;
    }

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
      height: 40px;
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

  audio {
    background: #f1f3f4 !important;
  }

  ::v-deep .video-js {
    height: 100% !important;
    background: $split-line-color;

    .vjs-big-play-button {
      transform: scale(0.7);
    }
  }
}
</style>
