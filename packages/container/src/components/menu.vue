<template>
  <div id="client-menu">
    <div class='menu-item' @click='handleMenuSwitch("/")'>菜单1</div>
    <div class='menu-item' @click='handleMenuSwitch("/view")'>菜单2</div>
  </div>
</template>

<script>
export default {
  name: 'MainMenu',
  methods: {
    handleMenuSwitch(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style scoped lang="scss">
#client-menu {
  width: 50px;
  height: 100%;
  background-color: blanchedalmond;
}
</style>
