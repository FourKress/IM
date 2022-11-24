<template>
  <div id="client-plugIn">
    <plugin />
  </div>
</template>

<script>
export default {
  name: 'MainPlugIn',
  components: {},
};
</script>

<style scoped lang="scss">
#client-plugIn {
  width: 565px;
  min-width: 565px;
  background-color: $bg-white-color;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
  border-radius: 10px 10px 0 0;
  margin-left: 6px;
  overflow: hidden;
}
</style>
