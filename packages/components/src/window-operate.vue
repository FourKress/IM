<template>
  <div class="window-action">
    <el-dropdown
      trigger="click"
      @command="handleOpenSynergy"
      style="display: flex"
      v-if="!isLogin"
    >
      <el-tooltip
        class="btn"
        effect="dark"
        content="协同模式"
        placement="bottom"
      >
        <LsIcon icon="ls-icon-zxh" width="24" height="24" render-svg></LsIcon>
      </el-tooltip>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <div class="send-down-row">
            <LsIcon render-svg icon="pop_cd_sz"></LsIcon>
            <span>{{ synergyStatus ? '关闭' : '开启' }}协同模式</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

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
  }
}
</style>
