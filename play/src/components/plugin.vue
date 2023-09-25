<template>
  <div class="plugin-container" v-show="visible">
    <PluginAppHeader
      :appKey="appConfig.key"
      @close="handleClose"
      @update="handleUpdate"
    />
    <div class="plugin-main" id="micro-app-container"></div>
  </div>
</template>

<script>
import { PluginAppHeader } from '@lanshu/plugin';
import { mapGetters, mapActions } from 'vuex';
import { loadQiankunMicroApp, microShared } from '@lanshu/micro';
import { MICRO_KEY_CONFIG, MICRO_EVENT_IPC } from '@lanshu/utils';

export default {
  name: MICRO_KEY_CONFIG.SMART_ADVOCACY,
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    PluginAppHeader,
  },
  computed: {
    ...mapGetters('globalStore', ['microAppList']),

    appConfig() {
      const app =
        this.microAppList.find(
          (d) => d.key === MICRO_KEY_CONFIG.SMART_ADVOCACY,
        ) || {};
      return app;
    },
  },
  data() {
    return {
      MICRO_KEY_CONFIG,
      microApp: null,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.$emit('update:pluginStyle', {
          flex: '1 1 0',
          minWidth: '400px',
        });

        if (!this.microApp) {
          this.loadMicroApp();
        }
      }
    },
    appConfig: {
      deep: true,
      handler(val = {}, oldVal) {
        const { path = '' } = val;
        if (path && path !== oldVal && this.microApp) {
          microShared.EventIPC(this.appConfig.key, {
            type: MICRO_EVENT_IPC.ROUTER_JUMP,
            value: `/${this.appConfig.key}${path}`,
          });
        }
      },
    },
  },
  mounted() {},
  methods: {
    ...mapActions('microVuexStore', ['setMicroLoadingTarget']),

    loadMicroApp() {
      this.$nextTick(() => {
        // 微应用加载loading的挂载容器
        this.setMicroLoadingTarget('#zsk');

        this.microApp = loadQiankunMicroApp(
          [
            {
              name: this.appConfig.key,
              entry: this.appConfig.url,
              container: '#micro-app-container',
              targetPath: this.appConfig.path,
            },
          ],
          {
            beforeLoadHandler: (app) => {
              console.log(app);
              console.log('主应用2 beforeLoadHandler');
            },
            afterMountHandler: () => {
              console.log('主应用2 afterMountHandler');
            },
            globalErrorHandler: () => {
              window.ClientMessage.error(
                '微应用加载失败，请检查应用是否可运行',
              );
              console.log('主应用2 globalErrorHandler');
            },
          },
        );
      });
    },

    handleClose() {},

    handleUpdate() {
      this.handleUnmountApp();
      this.loadMicroApp();
    },

    handleUnmountApp() {
      if (this.microApp) this.microApp.unmount();
    },
  },
  beforeDestroy() {
    this.handleUnmountApp();
  },
};
</script>

<style scoped lang="scss">
.plugin-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-white-color;
  position: relative;

  .plugin-main {
    flex: 1;
    overflow: hidden;
    background-color: $bg-IM-color;
  }
}
</style>
