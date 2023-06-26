<template>
  <div class="main-view">
    <MainSideBar />
    <MainIM />
    <MainPlugIn v-if="hasPlugin" />
  </div>
</template>

<script>
import { MainSideBar } from '@lanshu/sidebar';
import { MainIM } from '@lanshu/im';
import { MainPlugIn } from '@lanshu/plugin';
import { startQiankun } from '@lanshu/micro';
import micro from '../../micro';
import { renderProcess } from '@lanshu/render-process';
import { CLIENT_TERMINAL } from '@lanshu/utils';

export default {
  name: 'MainView',
  components: {
    MainSideBar,
    MainPlugIn,
    MainIM,
  },
  data() {
    return {
      hasPlugin: false,
    };
  },
  async created() {
    // 获取入口是否传入Plugin项
    const hasPlugin = JSON.parse(localStorage.getItem('hasPlugin') || 'false');
    const isGovernment =
      (await renderProcess.getStore('CLIENT_TERMINAL')) ===
      CLIENT_TERMINAL.IS_GOVERNMENT;
    this.hasPlugin = hasPlugin && isGovernment;
  },
  mounted() {
    this.$nextTick(() => {
      startQiankun(micro.getConfigs(), {
        beforeLoadHandler: (app) => {
          console.log('主应用 beforeLoadHandler')
        },
        afterMountHandler: () => {
          console.log('主应用 afterMountHandler')
        },
        globalErrorHandler: () => {
          window.ClientMessage.error('微应用加载失败，请检查应用是否可运行');
          console.log('主应用 globalErrorHandler')
        },
      });
    });
  },
};
</script>

<style scoped lang="scss">
.main-view {
  width: 100%;
  display: flex;
  background-color: transparent !important;
  padding: 0 !important;

  overflow-x: auto;
}
</style>
