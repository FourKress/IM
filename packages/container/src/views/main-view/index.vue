<template>
  <div class="main-view">
    <MainSideBar />
    <MainIM />
    <MainPlugIn v-if='hasPlugin' />
  </div>
</template>

<script>
import { MainSideBar } from '@lanshu/sidebar';
import { MainIM } from '@lanshu/im';
import { MainPlugIn } from '@lanshu/plugin';
import startQiankun from '../../micro'

export default {
  name: 'MainView',
  components: {
    MainSideBar,
    MainPlugIn,
    MainIM
  },
  data() {
    return {
      hasPlugin: false,
    }
  },
  created() {
    // 获取入口是否传入Plugin项
    this.hasPlugin = JSON.parse(localStorage.getItem('hasPlugin') || 'false');
  },
  mounted() {
    this.$nextTick(() => {
      startQiankun();
    })
  }
};
</script>

<style scoped lang='scss'>
.main-view {
  width: 100%;
  display: flex;
  background-color: transparent !important;
  padding: 0 !important;
}
</style>
