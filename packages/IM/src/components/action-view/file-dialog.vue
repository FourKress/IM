<template>
  <div class="file-dialog">
    <div class="title">发送给: {{ mainSessionWindow.nickname }}</div>
    <div class="main">
      <div class="list">
        <div class="scroll-view">
          <div class="item" v-for="(item, index) in fileList">
            <div class="view">
              <img
                :ref="item.name"
                class="tag"
                v-if="item.type === checkMsgType.isImage"
                :src="item.path"
                alt=""
              />
              <video
                :ref="item.name"
                class="tag"
                v-else-if="item.type === checkMsgType.isVideo"
                :src="item.path"
              ></video>

              <div
                class="tag audio file-icon"
                v-else-if="item.type === checkMsgType.isAudio"
              >
                <audio
                  :ref="item.name"
                  class="wrap"
                  controls
                  preload="auto"
                  width="300"
                  height="100"
                  :src="item.path"
                ></audio>

                <LsIcon
                  class="audio-icon"
                  icon="icon_wenjian"
                  render-svg
                  width="46"
                  height="46"
                ></LsIcon>
              </div>

              <div class="tag file-icon" v-else>
                <LsIcon
                  icon="icon_wenjian"
                  render-svg
                  width="46"
                  height="46"
                ></LsIcon>
              </div>
            </div>
            <div class="info">
              <span class="name">{{ item.name }}</span>
              <span class="tips">{{ item.formatSize }}</span>
            </div>
            <div class="close-icon" @click="handleUnSelect(index)">
              <LsIcon
                icon="a-icon_close2x"
                width="14"
                height="14"
                render-svg
              ></LsIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-list">
      <span class="btn cancel" @click="handleClose">取消</span>
      <span class="btn confirm" @click="handleConfirm">确定</span>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { mapGetters } from 'vuex';
import { getFileSize, getObjectURL, checkMsgType } from '@lanshu/utils';

export default {
  name: 'File-dialog',
  props: {
    files: {
      type: Array,
      required: true,
      default: [],
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      fileList: [],
      checkMsgType,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow']),
  },
  mounted() {
    this.fileList = this.files.map((d) => {
      const { name, size, type } = d;
      return {
        name,
        formatSize: getFileSize(size),
        size,
        path: getObjectURL(d),
        type: type.replace(/\/\S+/g, ''),
        rawType: type,
        file: d,
      };
    });
  },
  methods: {
    handleClose() {

      this.$emit('close');
    },
    async handleConfirm() {
      const fileList = await Promise.all(
        this.fileList.map(async (d) => {
          switch (d.type) {
            case this.checkMsgType.isImage:
              const image = this.$refs[d.name][0];
              return {
                ...d,
                width: image.naturalWidth,
                height: image.naturalHeight,
              };
              break;
            case this.checkMsgType.isVideo:
              const video = this.$refs[d.name][0];
              return {
                ...d,
                time: video.duration,
              };
              break;
            case this.checkMsgType.isAudio:
              const audio = this.$refs[d.name][0];
              const time = await this.countAudioTime(audio);
              return {
                ...d,
                time,
              };
              break;
            default:
              return d;
              break;
          }
        }),
      );

      this.$emit('confirm', fileList);
    },
    handleUnSelect(index) {
      this.fileList.splice(index, 1);
      if (!this.fileList?.length) {
        this.handleClose()
      }
    },
    // 计算音频的时长
    async countAudioTime(audio) {
      while (isNaN(audio.duration) || audio.duration === Infinity) {
        // 延迟一会 不然卡死
        await new Promise((resolve) => setTimeout(resolve, 200));
        // 设置随机播放时间，模拟调进度条
        audio.currentTime = 10000000 * Math.random();
      }
      return audio.duration;
    },
  },
};
</script>

<style scoped lang="scss">
.file-dialog {
  width: 420px;
  height: 408px;
  display: flex;
  flex-direction: column;

  background: $bg-white-color;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border-radius: 12px;
  border: 1px solid $split-line-color;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
    background-color: $bg-white-color;
    font-size: 16px;
    font-weight: bold;
    color: $main-text-color;
    box-sizing: border-box;
  }

  .main {
    flex: 1;
    height: calc(100% - 50px);
    border-top: 1px solid $split-line-color;
    box-sizing: border-box;
    padding: 16px 0;

    ::-webkit-scrollbar {
      display: none;
    }

    .list {
      height: 269px;
      padding: 0 30px;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      transform: translate3d(0, 0, 0);

      .scroll-view {
        .item {
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          margin-bottom: 12px;

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
              background-color: $bg-hover-grey-color;
              position: relative;

              &.audio {
                audio {
                  width: 0;
                }

                .audio-icon {
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 2;
                }
              }

              &.file-icon {
                background-color: transparent;
              }
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
              color: $tips-text-color;
              font-size: 14px;
            }
          }

          .close-icon {
            cursor: pointer;
          }
        }
      }
    }
  }

  .btn-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    .btn {
      width: 88px;
      height: 34px;
      border-radius: 6px;
      font-size: 14px;
      line-height: 34px;
      text-align: center;
      margin-left: 10px;
      cursor: pointer;

      &.cancel {
        background-color: $bg-grey-color;
        color: $minor-text-color;
      }

      &.confirm {
        background-color: $primary-color;
        color: $bg-white-color;
      }
    }
  }
}
</style>
