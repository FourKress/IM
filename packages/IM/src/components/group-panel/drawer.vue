<template>
  <div class="drawer">
    <el-drawer
      custom-class="group-manager"
      destroy-on-close
      :show-close="false"
      :wrapperClosable="false"
      :modal="false"
      :size="300"
      :close-on-press-escape="false"
      :visible.sync="visible"
    >
      <span slot="title" class="drawer-title">
        <LsIcon
          class="title-icon"
          width="14"
          height="28"
          icon="a-icon_gengduo22x"
          @click="handleCloseDrawer"
        ></LsIcon>
        {{ title }}
      </span>

      <slot></slot>
    </el-drawer>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';

export default {
  name: 'Drawer',
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    handleCloseDrawer() {
      this.visible = false;
      this.$emit('close', false);
    },
  },
};
</script>

<style scoped lang="scss">
.drawer {
  ::v-deep .el-drawer__wrapper {
    width: 299px;
    position: absolute;
    top: 0;
    left: 0;

    .el-drawer__header {
      padding: 10px 20px;
      margin-bottom: 0;
      box-shadow: 0 0 0 1px $split-line-color;
    }

    .drawer-title {
      display: flex;
      align-items: center;
      color: $main-text-color;
      font-size: 16px;
      font-weight: bold;

      .title-icon {
        width: 14px;
        height: 28px;
        margin-right: 16px;
        color: $minor-text-color;
        transform-origin: center;
        transform: rotateZ(180deg);
        cursor: pointer;
      }
    }
  }
}
</style>
