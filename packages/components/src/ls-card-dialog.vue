<template>
  <div
    class="ls-card-dialog"
    :style="{ backgroundColor: backgroundColor }"
    v-if="visible"
    @click.self.stop="handleClose"
  >
    <slot></slot>
  </div>
</template>

<script>
import { setHeaderClassName } from '@lanshu/utils';

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
        // 打开时，头部禁止拖动
        setHeaderClassName('no-drag');
        document.body.appendChild(this.$el);
      } else {
        const cardDialogDom = document.querySelectorAll('.ls-card-dialog');
        // 关闭时，恢复头部拖动功能
        if (cardDialogDom.length === 1) {
          setHeaderClassName('drag');
        }
        this.handleRemoveDom();
      }
    },
  },
  methods: {
    handleEmit() {
      this.$emit('close');
      this.$emit('update:visible', false);
    },
    handleClose() {
      if (!this.isModalClose) return;
      this.handleEmit();
    },
    handleRemoveDom() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
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
