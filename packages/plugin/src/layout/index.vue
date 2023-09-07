<template>
  <div class="client-plugIn" :style="pluginStyle">
    <component
      :is="component"
      :key="component"
      :pluginStyle.sync="pluginStyle"
      :visible="visible"
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
    },
    visible: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      pluginStyle: {
        flex: '1 1 0',
      },
    };
  },
};
</script>

<style scoped lang="scss">
.client-plugIn {
  min-width: 72px;
  width: auto;
  border-left: 1px solid $split-line-color;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
