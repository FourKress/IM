<template>
  <div id="client-menu">
    <div class="block"></div>
    <div class="menu-panel">
      <div
        class="menu-item"
        v-for="(item, index) in navList"
        :class="activeIndex === index && 'active'"
        @click="handleMenuSwitch(item.path, index)"
      >
        <span class="btn-icon"></span>
        <span>{{ item.label }}</span>
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
      navList: [],
    };
  },
  created() {
    const navList = new Array(1).fill({}).map((d , index) => {
      return {
        label: '办事',
        path: index === 0 ? '/' : '/view1',
      };
    });
    const pluginMenu = JSON.parse(localStorage.getItem('menu') || '[]');
    this.navList = navList.concat(pluginMenu);
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
  background: $gradient-sidebar-color;
  padding-bottom: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  ::-webkit-scrollbar {
    display: none;
  }

  .block {
    height: 42px;
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

      &.active {
        background-color: $bg-white-color;
        box-shadow: $bg-select-shadow;
        border-radius: 8px;
        color: $primary-color;

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
