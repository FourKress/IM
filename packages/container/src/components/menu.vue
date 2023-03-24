<template>
  <div id="client-menu">
    <div class="block"></div>
    <div class="menu-panel">
      <div
        class="menu-item"
        v-for="item in navList"
        :key='item.path'
        :class="activePath === item.path && 'active'"
        @click="handleMenuSwitch(item.path)"
      >
        <span class="btn-icon">
          <LsIcon
            render-svg
            width="20"
            height="20"
            :icon="
              activePath === item.path ? item.activeIcon : item.disableIcon
            "
          ></LsIcon>
        </span>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import BaseRoutes from '../router';
import { LsIcon } from '@lanshu/components';

export default {
  name: 'MainMenu',
  components: {
    LsIcon,
  },
  data() {
    return {
      activePath: '/',
      navList: [],
    };
  },
  watch: {
    $route(val) {
      this.activePath = val.path;
    },
  },
  created() {
    // 获取入口传入的Menu项
    const pluginMenu = JSON.parse(localStorage.getItem('menu') || '[]');

    this.navList = BaseRoutes.filter((r) => r?.meta?.isMenu)
      .map((r) => {
        const meta = r?.meta;
        return {
          label: meta?.name,
          path: r.path,
          disableIcon: meta?.disableIcon,
          activeIcon: meta?.activeIcon,
        };
      })
      .concat(pluginMenu);
  },
  methods: {
    handleMenuSwitch(path) {
      if (this.activePath === path) return;
      this.activePath = path;
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
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>
