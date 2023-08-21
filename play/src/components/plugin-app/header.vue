<template>
  <div class="plugin-app-header">
    <div class="left">
      <LsIcon size="12" color="#333" icon="ls-icon-a-icon_gengduo22x"></LsIcon>
      <LsIcon
        size="12"
        color="#c8c9cc"
        icon="ls-icon-a-icon_gengduo22x"
      ></LsIcon>
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

export default {
  name: 'PluginAppHeader',
  props: {
    title: {
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
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.plugin-app-header {
  width: 100%;
  height: 48px;
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
