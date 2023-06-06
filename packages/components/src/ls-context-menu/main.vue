<template>
  <div class="context_menu-popover" v-if="visible" :style="position">
    <div class="context_menu-list">
      <div
        class="context_menu-item"
        v-for="(item, index) in menuList"
        :key="index"
        @click="contextMenuSure(item)"
      >
        <Expand v-if="item.render" :render="item.render"></Expand>
        <div v-if="item.label" v-html="item.label"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Expand from '../utils/expand';

export default {
  components: { Expand },
  data() {
    return {
      visible: false,
      menuList: [],
      position: {},
    };
  },
  methods: {
    open(data = {}) {
      const { menuList = [], position = {} } = data;
      this.menuList = menuList;
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
      const path = [...event.path];
      const isPopover = path.some((d) => d.className === 'context_menu-item');
      console.log('isPopover', isPopover, path);
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

  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
}
</style>
