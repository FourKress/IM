<template>
  <div id="client-menu">
    <div class="block"></div>
    <div class="menu-panel">
      <div
        class="menu-item"
        v-for="(item, index) in navList"
        :class="activeIndex === index && 'active'"
        @click="handleMenuSwitch('/', index)"
      >
        <span class="btn-icon"></span>
        <span>办事</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainMenu',
  data() {
    return {
      activeIndex: 0,
      navList: new Array(10).fill(''),
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
  background: linear-gradient(180deg, #dde2ef 0%, #e8e8f3 58%, #dde2ef 100%);
  padding-bottom: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  ::-webkit-scrollbar {
    display: none;
  }

  .block {
    height: 64px;
  }

  .menu-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;
    transform: translate3d(0, 0, 0);

    .menu-item {
      width: 60px;
      height: 60px;
      min-height: 60px;
      font-size: 12px;
      line-height: 17px;
      color: #6f8ab9;
      cursor: pointer;
      transform: translate3d(0, 0, 0);

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      transition: all 0.3s;

      .btn-icon {
        width: 20px;
        height: 20px;
        background-color: #ccc;
        margin-bottom: 4px;
        transition: all 0.3s;
      }

      &.active,
      &:hover {
        background: #ffffff;
        box-shadow: 0 2px 10px 0 rgba(51, 51, 51, 0.1);
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
}
</style>
