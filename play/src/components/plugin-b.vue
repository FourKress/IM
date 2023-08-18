<template>
  <div class="plugin-container">
    <PluginAppHeader title="这是另一个应用" />
    <div class="plugin-main">这是另一个应用</div>
  </div>
</template>

<script>
import PluginAppHeader from './plugin-app/header.vue';

export default {
  name: 'SelfPluginB',
  components: { PluginAppHeader },
  mounted() {
    this.$emit('update:pluginStyle', {
      flex: '1 1 0',
      minWidth: '400px',
    });
  },
};
</script>

<style scoped lang="scss">
.plugin-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-white-color;
  position: relative;

  .plugin-main {
    flex: 1;
    background-color: $bg-IM-color;
  }
}
</style>
