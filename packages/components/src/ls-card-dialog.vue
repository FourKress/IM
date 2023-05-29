<template>
  <div class="ls-card-dialog" :style="{backgroundColor: backgroundColor}" v-if="visible" @click.self.stop="handleClose">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Ls-card-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    isModalClose: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: 'transparent',
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.setClassName('no-drag');
        document.querySelector('#lanshu-app').appendChild(this.$el);
      } else {
        const cardDialogDom = document.querySelectorAll('.ls-card-dialog');
        if (cardDialogDom.length === 1) {
          this.setClassName('drag');
        }
        this.handleRemoveDom();
      }
    },
  },
  methods: {
    handleClose() {
      if (!this.isModalClose) return;
      this.$emit('update:visible', false);
    },
    handleRemoveDom() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    },
    setClassName(className) {
      const hearerSearch = document.querySelector('#client-header');
      if (hearerSearch) {
        // 控制头部拖拽效果
        hearerSearch.className = `${className}`;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.ls-card-dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 990;
  transition: all 0.3s;
}
</style>
