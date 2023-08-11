<template>
  <div class="window-action">
    <span
      class="synergy-btn btn"
      :class="synergyStatus && 'active'"
      style="z-index: 0"
      v-if="!isLogin"
      @click="handleOpenSynergy"
    >
      <LsIcon icon="ls-icon-icon_yemianbuju" size="14"></LsIcon>
      <span class="label">协同</span>
    </span>

    <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_MIN)">
      <LsIcon
        icon="ls-icon-zuixiaohua1"
        width="12"
        height="12"
        render-svg
      ></LsIcon>
    </span>
    <span
      class="btn"
      v-if="!isLogin"
      @click="handleWindowChange(WIN_ACTION_TYPE.IS_MAX)"
    >
      <LsIcon
        :icon="isMax ? 'ls-icon-icon_quxiaozuidahua' : 'ls-icon-zuidahua'"
        width="12"
        height="12"
        render-svg
      ></LsIcon>
    </span>
    <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_HIDE)">
      <LsIcon icon="ls-icon-guanbi" width="12" height="12" render-svg></LsIcon>
    </span>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import LsIcon from './ls-icon';
import { WINDOW_TYPE, WIN_ACTION_TYPE } from '@lanshu/utils';
import { mapGetters, mapActions } from 'vuex';

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
  computed: {
    ...mapGetters('IMStore', ['synergyStatus']),
  },
  data() {
    return {
      WIN_ACTION_TYPE,
      isMax: false,
    };
  },
  methods: {
    ...mapActions('IMStore', ['setSynergyStatus']),

    handleWindowChange(type) {
      if (type === this.WIN_ACTION_TYPE.IS_MAX) {
        this.isMax = !this.isMax;
      }
      // isMain => 主窗口标识
      renderProcess.changeWindow(type, WINDOW_TYPE.IS_MAIN);
    },

    handleOpenSynergy() {
      this.setSynergyStatus(!this.synergyStatus);
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

  .btn {
    width: 24px;
    height: 24px;
    margin-left: 10px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;

    &.synergy-btn {
      width: 64px;
      height: 28px;
      background: #d3d9e9;
      border-radius: 6px;
      font-size: 14px;
      color: $main-text-color;
      display: flex;
      align-items: center;
      justify-content: center;

      .label {
        padding-left: 6px;
      }

      &.active {
        background: $primary-color;
        color: #fff;
      }
    }
  }
}
</style>
