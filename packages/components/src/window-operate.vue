<template>
  <div class="window-action">
    <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_MIN)">
      <LsIcon icon="navi_zxh_icon" render-svg></LsIcon>
    </span>
    <span
      class="btn"
      :class="isLogin && 'disable'"
      @click="handleWindowChange(WIN_ACTION_TYPE.IS_MAX)"
    >
      <LsIcon
        :icon="isFull ? 'ls-icon-icon_zuixiaohua1' : 'navi_sx_icon'"
        render-svg
      ></LsIcon>
    </span>
    <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_CLOSE)">
      <LsIcon icon="navi_gb_icon" render-svg></LsIcon>
    </span>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import LsIcon from './ls-icon';
import { WINDOW_TYPE, WIN_ACTION_TYPE } from '@lanshu/utils';

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
      WIN_ACTION_TYPE,
      isFull: false,
    };
  },
  methods: {
    handleWindowChange(type) {
      if (type === this.WIN_ACTION_TYPE.IS_MAX) {
        if (this.isLogin) return;
        this.isFull = !this.isFull;
      }
      // isMain => 主窗口标识
      renderProcess.changeWindow(type, WINDOW_TYPE.IS_MAIN);
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
