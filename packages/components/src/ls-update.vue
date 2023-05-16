<template>
  <div class="update-panel">
    <div class="top">
      <img class="img" :src="LsAssets.updateBg" alt="" />
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
        <span class="tips">新版本正在努力更新中，请耐心等待…</span>
      </div>
    </template>
    <template v-else>
      <div class="container">
        <div class="title">离开大陆就大撒大撒但是</div>
        <div class="text-wrap">
          <div class="scroll-view" v-html="richText"></div>
        </div>
      </div>
      <div class="footer">
        <span class="left btn" @click="handleClose">退出</span>
        <span class="right btn" @click="handleStartUpdate">立即更新</span>
      </div>
    </template>
  </div>
</template>

<script>
import { LsAssets } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';
import { WINDOW_TYPE, WIN_ACTION_TYPE } from '@lanshu/utils';
import { mapActions } from 'vuex';

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
      richText:
        'dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>dddddd <br/>',
    };
  },
  created() {
    renderProcess.downloadProgress((event, progress) => {
      this.downloadProgress = progress;
      console.log(progress);
    });
  },
  methods: {
    ...mapActions('globalStore', ['setStartDownload']),

    async handleClose() {
      const hasWindow = await renderProcess.hasWindow('TRTCWindow');
      if (hasWindow) {
        renderProcess.changeWindow(
          this.WIN_ACTION_TYPE.IS_CLOSE,
          WINDOW_TYPE.IS_TRTC,
        );
      }
      renderProcess.changeWindow(this.WIN_ACTION_TYPE.IS_CLOSE, WINDOW_TYPE.IS_MAIN);
    },
    handleStartUpdate() {
      console.log(122112);
      this.setStartDownload(true);
      renderProcess.checkForUpdates();
    },
  },
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
}
</style>
