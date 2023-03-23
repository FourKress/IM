<template>
  <div class="ls-network" v-if="IM_Network_Status === -1">
    <LsIcon render-svg icon="a-icon_duanwang2x" width="20" height="17"></LsIcon>
    <span class="label">网络异常，连接中...</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LsIcon from './ls-icon.vue';
export default {
  name: 'Ls-Network',
  components: {
    LsIcon,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'IM_Network_Status']),
  },
}
</script>

<style scoped lang="scss">
.ls-network {
  width: 280px;
  height: 46px;
  background: #FFEBEA;
  border-radius: 4px;
  border: 1px solid $minor-red-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: normal;
  color: #F65951;

  .label {
    padding-left: 6px;
  }
}
</style>