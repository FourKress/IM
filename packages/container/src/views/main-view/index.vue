<template>
  <div class="main-view">
    <MainSideBar />
    <div class="main-panel">
      <MainIM />
      <MainPlugIn
        v-for="plugin in plugins"
        v-if="plugin.visible"
        :key="plugin.key"
        :component="plugin.key"
      />
    </div>
  </div>
</template>

<script>
import { MainSideBar } from '@lanshu/sidebar';
import { MainIM } from '@lanshu/im';
import { MainPlugIn } from '@lanshu/plugin';
import { startQiankun } from '@lanshu/micro';
import { mapGetters } from 'vuex';
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
      plugins: [],
    };
  },
  computed: {
    ...mapGetters('globalStore', ['openMicroApp']),
  },
  watch: {
    openMicroApp: {
      deep: true,
      handler(val) {
        if (val?.appName) {
          this.plugins = this.plugins.map((d) => {
            if (d.key === val?.appName) {
              d.visible = true;
            }
            return {
              ...d,
            };
          });
        }
      },
    },
  },
  async created() {
    // 获取入口是否传入Plugins项
    const plugins = JSON.parse(localStorage.getItem('plugins') || '[]');
    const isGovernment =
      (await renderProcess.getStore('CLIENT_TERMINAL')) ===
      CLIENT_TERMINAL.IS_GOVERNMENT;
    if (plugins?.length && isGovernment) {
      this.plugins = plugins;
    }
  },
  mounted() {
    this.$nextTick(() => {
      startQiankun(micro.getConfigs(), {
        beforeLoadHandler: (app) => {
          console.log('主应用 beforeLoadHandler');
        },
        afterMountHandler: () => {
          console.log('主应用 afterMountHandler');
        },
        globalErrorHandler: () => {
          window.ClientMessage.error('微应用加载失败，请检查应用是否可运行');
          console.log('主应用 globalErrorHandler');
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

  .main-panel {
    height: 100%;
    flex: 1;
    display: flex;
  }
}
</style>
