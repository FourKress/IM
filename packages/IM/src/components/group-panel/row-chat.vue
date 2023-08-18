<template>
  <div class="item" @click="handleClick">
    <div class="info" v-if="title || label">
      <span class="title" v-if="title">{{ title }}</span>
      <span class="label" v-if="label">{{ label }}</span>
      <slot></slot>
    </div>
    <slot name="right-btn" v-if="showRightBtn || $slots['right-btn']">
      <i class="el-icon-arrow-right"></i>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Row-chat',
  props: {
    label: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    showRightBtn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(event) {
      this.$emit('callback', event);
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  cursor: pointer;

  .label {
    font-size: 14px;
    color: $main-text-color;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    font-size: 14px;

    ::v-deep .el-input,
    .el-select {
      width: 100%;
    }

    .title {
      color: $minor-text-color;
      margin-bottom: 6px;
    }
  }
}
</style>
