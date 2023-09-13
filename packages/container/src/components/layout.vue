<template>
  <div id="client-container">
    <div class="container">
      <MainMenu />
      <div class="view-container">
        <div :id="MICRO_CONTAINER" class="micro-app" v-if="isMicro"></div>
        <router-view class="router-view" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import MainMenu from './menu';
import {
  MicroSharedObservable,
  microLoadingMixins,
  microShared,
} from '@lanshu/micro';
import { MICRO_CONTAINER, MICRO_EVENT_IPC, lodash } from '@lanshu/utils';
import { mapGetters, mapActions } from 'vuex';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'MainLayout',
  components: {
    MainMenu,
  },
  mixins: [microLoadingMixins],
  data() {
    return {
      MICRO_CONTAINER,
    };
  },
  computed: {
    ...mapGetters('microVuexStore', ['microSharedState']),
    ...mapGetters('IMStore', ['mainSessionWindow']),
  },
  watch: {
    microSharedState: {
      deep: true,
      async handler(val, oldVal) {
        console.log('microSharedState', val);
        const {
          openMicroApp = null,
          closeMicroApp = null,
          token = '',
          preview = {},
          ...other
        } = val;

        // 打开应用
        if (openMicroApp) {
          const isEqual = lodash.isEqual(openMicroApp, oldVal.openMicroApp);
          if (isEqual) return;
          const {
            appName = '',
            path = '',
            params: {},
          } = openMicroApp;

          if (appName) {
            await this.setCurrentMicroApp({
              appName,
              path,
              params: {},
              visible: true,
            });
            microShared.openMicroApp(null);
          }
        }
        // 关闭应用
        if (closeMicroApp) {
          const isEqual = lodash.isEqual(closeMicroApp, oldVal.closeMicroApp);
          if (isEqual) return;

          const { appName = '' } = closeMicroApp;
          if (appName) {
            await this.setCurrentMicroApp({
              appName,
              visible: false,
            });
            microShared.closeMicroApp(null);
          }
        }
        if (preview?.url && preview?.url !== oldVal?.preview?.url) {
          const { url } = preview;
          const [fileName, type] = url.split('/').pop().split('.');
          let cachePath = await renderProcess.getCacheFilePath(
            `${fileName}.${type}`,
          );
          if (!cachePath) {
            await renderProcess
              .saveCacheFile({
                url,
                fileName,
              })
              .catch(() => {
                preview.onError && preview.onError();
              })
              .finally(() => {
                preview.onFinally && preview.onFinally();
                microShared.openMicroApp('');
              });
            cachePath = await renderProcess.getCacheFilePath(
              `${fileName}.${type}`,
            );
          }
          preview.onSuccess && preview.onSuccess();
          renderProcess.previewAssets(cachePath);
          microShared.openMicroApp('');
        }

        // 各应用业务通信
        Object.keys(other).forEach((microAppName) => {
          const isEqual = lodash.isEqual(
            other[microAppName],
            oldVal[microAppName],
          );
          if (isEqual) return;

          const { EVENT_IPC } = other[microAppName];
          const { type, value } = EVENT_IPC;

          switch (type) {
            case MICRO_EVENT_IPC.CREATE_TEXT_MSG:
              if (value) {
                this.setCreateSessionTextMsg(value);
                microShared.EventIPC(microAppName, {
                  type: MICRO_EVENT_IPC.CREATE_TEXT_MSG,
                  value: '',
                });
              }
              break;
            case MICRO_EVENT_IPC.GET_USER_ID:
              microShared.EventIPC(microAppName, {
                type: MICRO_EVENT_IPC.GET_USER_ID,
                value: this.mainSessionWindow?.toUser,
              });
              break;
            default:
              break;
          }
        });
      },
    },
  },
  mounted() {
    // 订阅微应用的通信数据变化
    MicroSharedObservable.subscribe();
    this.setMicroAppName('MASTER');
  },
  methods: {
    ...mapActions('IMStore', ['setCreateSessionTextMsg']),
    ...mapActions('globalStore', ['setCurrentMicroApp']),
    ...mapActions('microVuexStore', ['setMicroAppName']),
  },

  destroyed() {
    // 取消订阅微应用的通信数据变化
    MicroSharedObservable.unsubscribe();
  },
};
</script>

<style scoped lang="scss">
#client-container {
  flex: 1;
  max-height: calc(100% - 70px);
  background-color: $bg-blue-color;
  height: calc(100% - 56px);
  box-shadow: 4px 0px 10px -4px rgb(51 51 51 / 10%);

  .container {
    display: flex;
    width: 100%;
    height: 100%;

    .view-container {
      flex: 1;
      display: flex;
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
      border-radius: 10px 0 0 0;
      overflow: hidden;
      margin-top: -14px;
      position: relative;

      .router-view {
        width: 100%;
        background-color: $bg-white-color;
      }

      & > ::v-deep .el-loading-mask {
        z-index: 9;
        .el-icon-loading {
          font-size: 20px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.micro-app {
  width: 100%;

  & > div {
    height: 100%;
  }
}
</style>
