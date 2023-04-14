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
import { mapGetters } from 'vuex';

export default {
  name: 'MainLayout',
  components: {
    MainMenu,
  },
  data() {
    return {
      microContainerId: microAppPathMark,
      microLoading: null,
    }
  },
  computed: {
    ...mapGetters('globalStore', ['microLoadStatus']),

    isMicro() {
      const path = this.$route.path;
      const isMicro = path.includes(microAppPathMark);
      if (isMicro) {
        this.handleMicroLoading(true)
      }
      return isMicro;
    },
  },
  watch: {
    microLoadStatus(val) {
      if (!val) {
        this.handleMicroLoading(false);
      }
    }
  },
  methods: {
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
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
  }
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
