<template>
  <div id="client-container">
    <div class="container">
      <MainMenu />
      <div class="view-container">
        <div :id="microContainerId" v-if="isMicro"></div>
        <div class="micro-bg" v- v-if="isMicro"></div>
        <router-view class="router-view" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import MainMenu from './menu';
import { microAppPathMark } from '@lanshu/utils';
import { mapGetters, mapActions } from 'vuex';
import microStore from '../micro/microStore';

export default {
  name: 'MainLayout',
  components: {
    MainMenu,
  },
  data() {
    return {
      microContainerId: microAppPathMark,
      microLoading: null,
    };
  },
  computed: {
    ...mapGetters('microStore', [
      'microLoadStatus',
      'microLoadPool',
      'microSharedState',
    ]),

    isMicro() {
      const path = this.$route.path;
      const isMicro = path.includes(microAppPathMark);
      const isLoaded = this.microLoadPool.some((d) => path.includes(d));
      if (isMicro && !isLoaded) {
        this.handleMicroLoading(true);
      }
      return isMicro;
    },
  },
  watch: {
    microLoadStatus(val) {
      if (!val) {
        this.handleMicroLoading(false);
        this.setMicroLoadStatus(true);
      }
    },
    microSharedState: {
      deep: true,
      handler(val) {
        console.log('microSharedState', val);
      },
    },
  },
  mounted() {
    microStore.subscribe();
  },
  methods: {
    ...mapActions('microStore', ['setMicroLoadStatus']),

    handleMicroLoading(isOpen) {
      if (!isOpen) {
        this.microLoading?.close();
        return;
      }
      this.microLoading = this.$loading({
        target: '.view-container',
        lock: true,
        text: '应用加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
      });
    },
  },

  destroyed() {
    microStore.unsubscribe();
  },
};
</script>

<style scoped lang="scss">
#client-container {
  flex: 1;
  max-height: calc(100% - 90px);
  background-color: $bg-blue-color;
  height: calc(100% - 68px);
  box-shadow: 4px 0px 10px -4px rgb(51 51 51 / 10%);

  .container {
    display: flex;
    width: calc(100% - 6px);
    height: 100%;

    .view-container {
      flex: 1;
      display: flex;
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      margin-top: -22px;
      position: relative;

      .router-view {
        width: 100%;
        background-color: $bg-white-color;
      }

      .micro-bg {
        position: absolute;
        left: 0;
        top: 0;
      }

      ::v-deep .el-icon-loading {
        font-size: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
#MicroApp {
  width: 100%;

  & > div {
    height: 100%;
  }
}
</style>
