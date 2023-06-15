<template>
  <div class="update-panel" :class="isLogin && 'is-login'" v-if="$route.name">
    <div class="top">
      <img class="img" v-if="isLogin" :src="LsAssets.updateBgLogin" alt="" />
      <img class="img" v-else :src="LsAssets.updateBg" alt="" />
      <span class="tips" v-if="isLogin">
        {{ startDownload ? '下载新版本' : '检测到新版本' }}
      </span>
    </div>

    <template v-if="startDownload">
      <div class="container">
        <div class="progress">
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            text-color="#fff"
            :percentage="downloadProgress"
          ></el-progress>
        </div>
        <span class="tips" :class="isUpdateError && 'error'">
          {{ isUpdateError ? '网络错误，请重试…' : '下载中，请耐心等待…' }}
        </span>
        <span class="error-btn" v-if="isUpdateError" @click="handleStartUpdate">
          重新下载
        </span>
      </div>
    </template>
    <template v-else>
      <div class="container">
        <div class="title">{{ updateInfo.title }}</div>
        <div class="text-wrap">
          <div class="scroll-view" v-html="updateInfo.content"></div>
        </div>
      </div>
      <div class="footer">
        <span class="left btn" @click="handleClose">
          {{ updateInfo.isForced ? '退出' : '跳过本次版本' }}
        </span>
        <span class="right btn" @click="handleStartUpdate">立即更新</span>
      </div>
    </template>
  </div>
</template>

<script>
import { LsAssets } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';
import { WINDOW_TYPE, WIN_ACTION_TYPE } from '@lanshu/utils';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Ls-Update',
  props: {
    startDownload: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      LsAssets,
      WIN_ACTION_TYPE,
      downloadProgress: 0,
      isUpdateError: false,
    };
  },
  computed: {
    ...mapGetters('globalStore', ['updateInfo']),

    isLogin() {
      return this.$route.name === 'Login';
    },
  },
  created() {
    renderProcess.downloadProgress((event, progress) => {
      if (progress === null) {
        this.isUpdateError = true;
        return;
      }
      this.downloadProgress = progress;
    });
    document.addEventListener('keydown', this.handleKeydown);
  },
  methods: {
    ...mapActions('globalStore', ['setStartDownload']),

    async handleClose() {
      if (!this.updateInfo.isForced) {
        this.$emit('cancel');
        return;
      }
      const hasWindow = await renderProcess.hasWindow('TRTCWindow');
      if (hasWindow) {
        renderProcess.changeWindow(
          this.WIN_ACTION_TYPE.IS_CLOSE,
          WINDOW_TYPE.IS_TRTC,
        );
      }
      renderProcess.changeWindow(
        this.WIN_ACTION_TYPE.IS_CLOSE,
        WINDOW_TYPE.IS_MAIN,
      );
    },
    handleStartUpdate() {
      this.isUpdateError = false;
      this.setStartDownload(true);
      const { fetchUrl, version } = this.updateInfo;
      renderProcess.checkForUpdates({ fetchUrl, version });
    },

    handleKeydown(event) {
      event.preventDefault();
    },
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped lang="scss">
.update-panel {
  width: 680px;
  height: 424px;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 8;
  display: flex;
  flex-direction: column;
  background: $bg-white-color;
  border-radius: 16px;
  overflow: hidden;

  .top {
    width: 100%;
    height: 160px;

    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .container {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 36px;

    .title {
      padding: 20px 0;
      box-sizing: border-box;
      font-size: 16px;
      color: $main-text-color;
      font-weight: bold;
    }

    .text-wrap {
      flex: 1;
      overflow-y: auto;
      transform: translate3d(0, 0, 0);

      .scroll-view {
      }
    }

    .progress {
      margin: 100px 0 24px 0;
    }

    .tips {
      font-size: 14px;
      color: $tips-text-color;
      text-align: center;

      &.error {
        color: $minor-red-color;
      }
    }

    .error-btn {
      width: 80px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      background: $primary-color;
      border-radius: 4px;
      margin: 20px auto 18px;
      cursor: pointer;
      font-size: 12px;
      color: $bg-white-color;
    }
  }

  .footer {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0;

    .btn {
      width: 140px;
      height: 40px;
      border-radius: 6px;
      background: $bg-IM-color;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      color: $bg-white-color;
      cursor: pointer;

      &.right {
        background: $primary-color;
        margin-left: 10px;
      }

      &.left {
        color: $minor-text-color;
      }
    }
  }

  &.is-login {
    width: 316px;
    height: auto;
    max-height: 380px;
    min-height: 204px;
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 8;
    display: flex;
    flex-direction: column;
    background: $bg-white-color;
    border-radius: 12px;
    overflow: hidden;

    .top {
      width: 100%;
      height: 74px;
      position: relative;

      .tips {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        color: $primary-color;
        letter-spacing: 1px;
        font-weight: bold;
      }
    }

    .container {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0 20px;

      .title {
        padding: 16px 0 10px 0;
        box-sizing: border-box;
        font-size: 13px;
        color: $main-text-color;
        font-weight: bold;
      }

      .text-wrap {
        flex: 1;
        overflow-y: auto;
        transform: translate3d(0, 0, 0);

        .scroll-view {
        }
      }

      .progress {
        margin: 40px 0 20px 0;
      }

      .tips {
        font-size: 13px;
        color: $tips-text-color;
        text-align: center;
      }
    }

    .footer {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0 16px 0;

      .btn {
        width: 130px;
        height: 34px;
        border-radius: 4px;
        background: $split-line-color;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        color: $bg-white-color;
        cursor: pointer;

        &.right {
          background: $primary-color;
          margin-left: 16px;
        }

        &.left {
          color: $minor-text-color;
        }
      }
    }
  }
}
</style>
