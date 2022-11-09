<template>
  <div id="client-menu">
    <div
      class="menu-item"
      :class="activeIndex === 1 && 'active'"
      @click="handleMenuSwitch('/', 1)"
    >
      <span class="btn-icon"></span>
      <span>办事</span>
    </div>
    <div
      class="menu-item"
      :class="activeIndex === 2 && 'active'"
      @click="handleMenuSwitch('/view', 2)"
    >
      <span class="btn-icon"></span>
      <span>台账</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainMenu',
  data() {
    return {
      activeIndex: 1,
    };
  },
  methods: {
    handleMenuSwitch(path, index) {
      this.activeIndex = index;
      this.$router.push(path);
    },
  },
};
</script>

<style scoped lang="scss">
#client-menu {
  width: 72px;
  height: 100%;
  background-color: blanchedalmond;
  padding-top: 64px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .menu-item {
    width: 60px;
    height: 60px;
    font-size: 12px;
    line-height: 17px;
    color: #6f8ab9;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transition: all .3s;

    .btn-icon {
      width: 20px;
      height: 20px;
      background-color: #ccc;
      margin-bottom: 4px;
      transition: all .3s;
    }

    &.active {
      background: #ffffff;
      box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.1);
      border-radius: 8px;
      color: #0066ff;

      .btn-icon {
        width: 20px;
        height: 20px;
        background-color: #333;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
