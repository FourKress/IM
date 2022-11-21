<template>
  <div id="client-container">
    <MainMenu />
    <div class="view-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import MainMenu from './menu';

export default {
  name: 'MainLayout',
  components: {
    MainMenu,
  },
};
</script>

<style scoped lang="scss">
#client-container {
  flex: 1;
  width: calc(100% - 6px);
  height: calc(100% - 68px);
  box-shadow: 4px 0px 10px -4px rgb(51 51 51 / 10%);
  display: flex;
  margin-top: -22px;

  .view-container {
    flex: 1;
    display: flex;
    background: #eeecef;
    box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
    border-radius: 10px 10px 0 0;
    overflow: hidden;
  }
}
</style>
