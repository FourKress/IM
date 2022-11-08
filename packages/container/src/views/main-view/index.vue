<template>
  <div class="main-view">
    <MainSideBar />
    <MainIM />
    <MainPlugIn />
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
  }
};
</script>

<style scoped lang='scss'>
.main-view {
  width: 100%;
  display: flex;
}
</style>
