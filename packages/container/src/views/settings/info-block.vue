<template>
  <div class="info-block">
    <div class="title">
      {{ title }}
      <slot name="tag"></slot>
    </div>
    <template v-if="!isSlot">
      <Expand v-if="render" :info="info" :render="render"></Expand>
      <div v-else class="info">
        {{ label || '' }}
        <span class="text" v-if="value">{{ value }}</span>
        <span class="btn" v-if="btnText" @click="handleClick">
          {{ btnText }}
        </span>
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script>
import Expand from './expand';

export default {
  name: 'info-block',
  components: {
    Expand,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    title() {
      return this.info?.title;
    },
    label() {
      return this.info?.label;
    },
    btnText() {
      return this.info?.btnText;
    },
    render() {
      return this.info?.render;
    },
    value() {
      return this.info?.value;
    },
    isSlot() {
      return this.$slots?.default;
    },
  },
  methods: {
    handleClick() {
      this.$emit('callback');
    },
  },
};
</script>

<style scoped lang="scss">
.info-block {
  margin-top: 26px;
  text-align: left;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: $main-text-color;
    margin-bottom: 10px;
  }

  .info {
    font-size: 14px;
    color: $minor-text-color;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .text {
      margin-right: 10px;
    }

    .btn {
      color: $primary-hover-color;
      cursor: pointer;
    }
  }
}
</style>
