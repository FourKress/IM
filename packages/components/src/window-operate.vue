<template>
  <div class="window-action">
    <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_MIN)">
      <LsIcon icon="ls-icon-zxh" width="24" height="24" render-svg></LsIcon>
    </span>
    <span
      class="btn"
      v-if="!isLogin"
      @click="handleWindowChange(WIN_ACTION_TYPE.IS_MAX)"
    >
      <LsIcon
        :icon="isFull ? 'ls-icon-zuixiaohua' : 'ls-icon-sx'"
        width="24"
        height="24"
        render-svg
      ></LsIcon>
    </span>
    <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_CLOSE)">
      <LsIcon icon="ls-icon-gb" width="24" height="24" render-svg></LsIcon>
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
    width: 24px;
    height: 24px;
    margin-left: 10px;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
