<template>
  <div class="context_menu-popover" v-if="visible" :style="position">
    <div class="context_menu-list">
      <div
        class="context_menu-item"
        v-for="(item, index) in menuList"
        :key="index"
        @click="contextMenuSure(item)"
      >
        <LsIcon :icon="item.icon(menuItemParams)" color="#777777"></LsIcon>
        <div class="label">
          <Expand v-if="item.render" :render="item.render"></Expand>
          <div v-if="item.label" v-html="item.label(menuItemParams)"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { LsIcon } from '@lanshu/components';
import Expand from '../utils/expand';

export default {
  components: { LsIcon, Expand },
  data() {
    return {
      visible: false,
      menuList: [],
      position: {},
      menuItemParams: {},
    };
  },
  methods: {
    open(data = {}) {
      const { menuList = [], position = {}, menuItemParams = {} } = data;
      this.menuList = menuList;
      this.menuItemParams = menuItemParams;
      this.position = position;
      this.visible = true;

      const currentContextMenu = document.querySelector(
        '.context_menu-popover',
      );
      if (currentContextMenu) {
        this.closeFnc(currentContextMenu);
      }

      document.addEventListener('click', this.handleCloseContentMenu);

      // 增加链式调用方式
      return new Promise((resolve, reject) => {
        this.promiseStatus = { resolve, reject };
      });
    },

    closeFnc(el) {
      if (el && el.parentNode) {
        document.removeEventListener('click', this.handleCloseContentMenu);
        el.parentNode.removeChild(el);
      }
    },
    handleCloseContentMenu(event) {
      if (!document.querySelector('.context_menu-popover')) return;
      const path = [...event.path];
      const isPopover = path.some((d) => d.className === 'context_menu-item');
      // TODO 未取消addEventListener，多次触发
      if (isPopover) return;
      this.closeFnc(this.$el);
    },

    contextMenuSure(menuItem) {
      this.closeFnc(this.$el);
      this.promiseStatus && this.promiseStatus.resolve(menuItem);
    },
  },
};
</script>
<style lang="scss" scoped>
.context_menu-popover {
  position: fixed;
  background-color: $bg-white-color;
  border-radius: 6px;
  padding: 8px;
  width: 136px;
  max-width: 136px;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border: 1px solid $split-line-color;
  box-sizing: border-box;

  .context_menu-list {
    width: 100%;

    .context_menu-item {
      width: 120px;
      height: 40px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      padding: 0 9px;
      cursor: pointer;

      font-size: 14px;
      color: $main-text-color;

      .label {
        padding-left: 10px;
      }

      &:hover {
        background-color: $bg-hover-grey-color;
      }
    }
  }
}
</style>
