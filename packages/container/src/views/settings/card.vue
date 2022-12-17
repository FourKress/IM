<template>
  <div class='settings-card'>
    <div class='title'>
      <span>{{ title }}</span>
    </div>
    <div class='card-content'>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'settingsCard',
  props: {
    title: {
      type: String,
      required: true,
    }
  }
};
</script>

<style scoped lang='scss'>
.settings-card {
  margin-bottom: 60px;

  .title {
    font-size: 20px;
    font-weight: bold;
    color: $main-text-color;

    &:after {
      display: block;
      content: ' ';
      width: 100%;
      margin-top: 20px;
      border-bottom: 1px solid $split-line-color;
    }
  }
}
</style>
