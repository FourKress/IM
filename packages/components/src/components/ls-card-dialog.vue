<template>
  <div class="ls-card-dialog" v-if="visible" @click.self.stop="handleClose">
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
  },
  watch: {
    visible(val) {
      if (val) {
        document.body.appendChild(this.$el);
      }
    },
  },
  methods: {
    handleClose() {
      this.handleRemoveDom();
      this.$emit('update:visible', false);
    },
    handleRemoveDom() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    },
  },
  destroyed() {
    this.handleRemoveDom();
  },
};
</script>

<style scoped lang="scss">
.ls-card-dialog {
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 990;
  transition: all 0.3s;
}
</style>
