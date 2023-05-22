<template>
  <div class="file-dialog">
    <div class="title">发送给: {{ mainSessionWindow.nickname }}</div>
    <div class="main">
      <div class="list">
        <div class="scroll-view">
          <div class="item" v-for="(item, index) in fileList" :key="index">
            <div class="view">
              <img
                :ref="item.name"
                class="tag"
                v-if="item.type === CHECK_MSG_TYPE.IS_IMAGE"
                :src="item.path"
                alt=""
              />
              <video
                :ref="item.name"
                class="tag"
                v-else-if="item.type === CHECK_MSG_TYPE.IS_VIDEO"
                :src="item.path"
              ></video>

              <div
                class="tag audio file-icon"
                v-else-if="item.type === CHECK_MSG_TYPE.IS_AUDIO"
              >
                <audio
                  :ref="item.name"
                  class="wrap"
                  controls
                  preload="auto"
                  :src="item.path"
                ></audio>
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
              <span class="tips" :class="checkFileSize(item) && 'error'">
                {{ item.formatSize }}
              </span>
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
      <el-button class="btn confirm" :loading="isUpload" @click="handleConfirm">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { mapGetters } from 'vuex';
import { getFileSize, getObjectURL, CHECK_MSG_TYPE } from '@lanshu/utils';

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
      CHECK_MSG_TYPE,
      isUpload: false,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow']),
  },
  mounted() {
    this.fileList = this.files.map((d) => {
      const { name, size, type } = d;
      const rawType = type;
      const isTextFile = !type || type.includes('text/');
      return {
        name,
        formatSize: getFileSize(size),
        size,
        path: getObjectURL(d),
        type: isTextFile ? 'application' : type.replace(/\/\S+/g, ''),
        rawType,
        file: d,
      };
    });
  },
  methods: {
    handleClose() {
      if (this.isUpload) return;
      this.$emit('close');
    },
    async handleConfirm() {
      const isFileSizeMax = this.fileList.some((d) => this.checkFileSize(d));
      if (isFileSizeMax) {
        this.$message.error('上传文件最大支持150M');
        return;
      }

      this.isUpload = true;

      const fileList = await Promise.all(
        this.fileList.map(async (d) => {
          switch (d.type) {
            case this.CHECK_MSG_TYPE.IS_IMAGE:
              const image = this.$refs[d.name][0];
              return {
                ...d,
                width: image.naturalWidth,
                height: image.naturalHeight,
              };
              break;
            case this.CHECK_MSG_TYPE.IS_VIDEO:
              const file = this.$refs[d.name][0];
              return {
                ...d,
                time: parseInt((file.duration * 1000).toString()),
              };
              break;
            case this.CHECK_MSG_TYPE.IS_AUDIO:
              const audio = this.$refs[d.name][0];
              const time = await this.countAudioTime(audio);
              return {
                ...d,
                time: parseInt((time * 1000).toString()),
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
      if (this.isUpload) return;
      this.fileList.splice(index, 1);
      if (!this.fileList?.length) {
        this.handleClose();
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

    checkFileSize(file) {
      const formatSize = file.formatSize;
      const [first, second] = formatSize.split(' ');
      return first > 150 && ![' B', 'KB'].includes(second);
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
                  width: 100px;
                  height: 46px;
                  background: #f1f3f4;
                  transform: translateX(-3px);
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

              &.error {
                color: $minor-red-color;
              }
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

        ::v-deep {
          border: none;
          line-height: 34px;
          padding: 0;
        }
      }
    }
  }
}
</style>
