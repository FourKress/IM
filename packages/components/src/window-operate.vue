<template>
  <div class="window-action">
    <el-popover
      placement="bottom-end"
      popper-class="synergy-popover"
      width="172"
      trigger="hover"
      v-if="!isLogin"
    >
      <div class="popover-panel">
        <LsIcon
          icon="ls-icon-icon_xietong"
          width="12"
          height="12"
          render-svg
        ></LsIcon>
        <span class="label">协同模式</span>
        <el-switch
          :value="synergyStatus"
          @change="handleOpenSynergy"
        ></el-switch>
      </div>
      <span slot="reference" class="btn">
        <LsIcon
          icon="ls-icon-icon_yemianbuju"
          width="12"
          height="12"
          render-svg
        ></LsIcon>
      </span>
    </el-popover>

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
        :icon="isFull ? 'ls-icon-icon_quxiaozuidahua' : 'ls-icon-zuidahua'"
        width="12"
        height="12"
        render-svg
      ></LsIcon>
    </span>
    <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_CLOSE)">
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
      isFull: false,
    };
  },
  methods: {
    ...mapActions('IMStore', ['setSynergyStatus']),

    handleWindowChange(type) {
      if (type === this.WIN_ACTION_TYPE.IS_MAX) {
        this.isFull = !this.isFull;
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
  z-index: 999;

  .btn {
    width: 24px;
    height: 24px;
    margin-left: 10px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<style scoped lang="scss">
.synergy-popover {
  .popover-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .label {
      flex: 1;
      padding-left: 8px;
      color: $main-text-color;
      font-weight: bold;
    }
  }
}
</style>
