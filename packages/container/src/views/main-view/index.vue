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
    this.hasPlugin = JSON.parse(localStorage.getItem('hasPlugin') || 'false');
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
