<template>
  <div class="main-view">
    <MainSideBar />
    <div
      class="main-panel"
      :style="{ maxWidth: `calc(100% - ${sessionList.length ? 265 : 0}px)` }"
    >
      <MainIM />
      <MainPlugIn
        v-if="mainSessionWindow.sessId && synergyStatus"
        key="Synergy"
        component="Synergy"
      />
      <template v-for="plugin in plugins">
        <MainPlugIn
          v-show="plugin.visible"
          :visible="plugin.visible"
          :key="plugin.key"
          :component="plugin.key"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { MainSideBar } from '@lanshu/sidebar';
import { MainIM } from '@lanshu/im';
import { MainPlugIn } from '@lanshu/plugin';
import { startQiankun } from '@lanshu/micro';
import { mapGetters } from 'vuex';
import { renderProcess } from '@lanshu/render-process';
import { CLIENT_TERMINAL } from '@lanshu/utils';
import micro from '../../micro';

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
    ...mapGetters('IMStore', [
      'sessionList',
      'synergyStatus',
      'mainSessionWindow',
    ]),
    ...mapGetters('globalStore', ['currentMicroApp']),
  },
  watch: {
    currentMicroApp: {
      deep: true,
      handler(val) {
        const { appKey, visible } = val || {};
        if (appKey) {
          this.plugins = this.plugins.map((d) => {
            const { alwaysShow, key } = d;
            return {
              ...d,
              visible: key === appKey ? visible : false || alwaysShow,
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
    box-shadow: 4px 0 10px -4px rgb(51 51 51 / 10%);
    border-radius: 0 10px 0 0;
  }
}
</style>
