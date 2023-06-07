<template>
  <div
    class="ls-network"
    v-if="IM_Network_Status !== IM_NETWORK_STATUS.IS_CONNECT"
  >
    <LsIcon render-svg icon="a-icon_duanwang2x" width="20" height="17"></LsIcon>
    <span class="label">网络异常，{{ IM_Network_Status === IM_NETWORK_STATUS.IS_BREAK ? '已断开' : '连接中...' }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { IM_NETWORK_STATUS } from '@lanshu/utils';
import LsIcon from './ls-icon.vue';
export default {
  name: 'Ls-Network',
  components: {
    LsIcon,
  },
  data() {
    return {
      IM_NETWORK_STATUS,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'IM_Network_Status']),
  },
};
</script>

<style scoped lang="scss">
.ls-network {
  width: 164px;
  height: 46px;
  background: #ffebea;
  border-radius: 4px;
  border: 1px solid $minor-red-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: normal;
  box-sizing: border-box;
  color: #f65951;

  .label {
    padding-left: 6px;
  }
}
</style>
