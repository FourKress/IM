<template>
  <div class="plugin-app-header">
    <div class="left">
      <LsIcon size="14" color="#333" icon="ls-icon-shuaxin"></LsIcon>
    </div>
    <div class="title">
      {{ title }}
    </div>
    <div class="right">
      <LsIcon
        size="12"
        color="#333"
        icon="ls-icon-guanbi"
        @click="handleClose"
      ></LsIcon>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { mapActions } from 'vuex';

export default {
  name: 'PluginAppHeader',
  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    appName: {
      type: String,
      default: '',
      required: true,
    },
  },
  components: { LsIcon },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    ...mapActions('globalStore', ['setOpenMicroApp']),
    ...mapActions('pluginStore', ['setActiveMicroApp']),

    handleClose() {
      this.$emit('close');
      this.setOpenMicroApp({
        appName: this.appName,
        visible: false,
      });
      this.setActiveMicroApp('');
    },
  },
};
</script>

<style scoped lang="scss">
.plugin-app-header {
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 16px;
  color: $main-text-color;
  font-weight: bold;

  .ls-icon-wrap {
    margin-left: 12px;
    cursor: pointer;

    &:first-child {
      margin-left: 0;
      transform-origin: center;
      transform: rotateZ(180deg);
    }
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
