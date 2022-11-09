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
  width: calc(100% - 20px);
  background-color: cadetblue;
  display: flex;
  margin-top: -22px;

  .view-container {
    flex: 1;
    display: flex;
  }
}
</style>
