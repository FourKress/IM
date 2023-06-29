<template>
  <div class="client-plugIn">
    <component
      :is="component"
      :key="component"
    ></component>
  </div>
</template>

<script>
export default {
  name: 'MainPlugIn',
  props: {
    component: {
      type: String,
      required: true,
    }
  },
};
</script>

<style scoped lang="scss">
.client-plugIn {
  width: auto;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
  border-radius: 10px 10px 0 0;
  margin-left: 6px;
  overflow: hidden;
}
</style>
