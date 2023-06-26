<template>
  <div class="client-plugIn">
    <div class="plugin-container"></div>
<!--    <div class="plugin-container"></div>-->
  </div>
</template>

<script>
export default {
  name: 'SelfPlugIn',
  components: {},
};
</script>

<style scoped lang="scss">
.client-plugIn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .plugin-container {
    height: 100%;
    width: 400px;
    background-color: $bg-white-color;
    border-radius: 10px 10px 0 0;
    margin-right: 6px;
    box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
