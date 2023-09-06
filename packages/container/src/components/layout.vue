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
import { MicroSharedObservable, microLoadingMixins } from '@lanshu/micro';
import { MICRO_CONTAINER } from '@lanshu/utils';
import { mapGetters, mapActions } from 'vuex';

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
  },
  watch: {
    microSharedState: {
      deep: true,
      handler(val) {
        console.log('microSharedState', val);
        const { EVENT_IPC = {} } = val;
        const { type, value } = EVENT_IPC;
        if (type === 'openMicro') {
          this.setOpenMicroApp({
            appName: EVENT_IPC.value,
            visible: value,
          });
        }
      },
    },
  },
  mounted() {
    // 订阅微应用的通信数据变化
    MicroSharedObservable.subscribe();
    this.setMicroAppName('MASTER');
  },
  methods: {
    ...mapActions('globalStore', ['setOpenMicroApp']),
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
