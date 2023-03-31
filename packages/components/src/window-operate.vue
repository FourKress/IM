<template>
  <div class="window-action">
    <span class="btn" @click="handleWindowChange(isMin)">
      <LsIcon icon="navi_zxh_icon" render-svg></LsIcon>
    </span>
    <span
      class="btn"
      :class="isLogin && 'disable'"
      @click="handleWindowChange(isMax)"
    >
      <LsIcon icon="navi_sx_icon" render-svg></LsIcon>
    </span>
    <span class="btn" @click="handleWindowChange(isClose)">
      <LsIcon icon="navi_gb_icon" render-svg></LsIcon>
    </span>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import LsIcon from './ls-icon';
import { windowType } from '@lanshu/utils';

export default {
  name: 'Window-action',
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      isMin: 'min',
      isMax: 'max',
      isClose: 'close',
    };
  },
  methods: {
    async handleWindowChange(type) {
      if (type === this.isMax && this.isLogin) return;
      // isMain => 主窗口标识
      if (type === this.isClose) {
        const hasWindow = await renderProcess.hasWindow('TRTCWindow');
        if (hasWindow) {
          this.$message.warning('请先结束当前通话');
          return;
        }
      }
      renderProcess.changeWindow(type, windowType.isMain);
    },
  },
};
</script>

<style scoped lang="scss">
.window-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;

  .btn {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    border-radius: 50%;
    cursor: pointer;

    &.disable {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
