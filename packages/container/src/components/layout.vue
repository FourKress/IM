<template>
  <div id="client-container">
    <div class='container'>
      <MainMenu />
      <div class="view-container">
        <router-view class='router-view' />
      </div>
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
  height: calc(100% - 90px);
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

      .router-view {
        width: 100%;
        display: flex;
        background-color: #fff;
        padding: 16px;
      }
    }
  }
}
</style>
