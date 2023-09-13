<template>
  <div class="plugin-container" v-show="visible">
    <PluginAppHeader
      :appName="MICRO_NAME_CONFIG.SMART_ADVOCACY"
      @close="handleClose"
    />
    <div class="plugin-main" id="micro-app-container"></div>
  </div>
</template>

<script>
import { PluginAppHeader } from '@lanshu/plugin';
import { mapActions } from 'vuex';
import { loadQiankunMicroApp } from '@lanshu/micro';
import { MICRO_NAME_CONFIG } from '@lanshu/utils';

export default {
  name: MICRO_NAME_CONFIG.SMART_ADVOCACY,
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    PluginAppHeader,
  },
  data() {
    return {
      MICRO_NAME_CONFIG,
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
              name: MICRO_NAME_CONFIG.SMART_ADVOCACY,
              entry: 'http://172.16.3.55:3006/',
              container: '#micro-app-container',
              targetPath: '/spokesman',
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
  },
  beforeDestroy() {
    if (this.microApp) this.microApp.unmount();
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
    background-color: $bg-IM-color;
  }
}
</style>
