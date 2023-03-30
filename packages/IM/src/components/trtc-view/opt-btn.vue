<template>
  <el-tooltip effect="dark" :content="tooltip" placement="top">
    <span class="btn" :class="className" @click="handleClick">
      <LsIcon :icon="icon"></LsIcon>
    </span>
  </el-tooltip>
</template>

<script>
import { LsIcon } from '@lanshu/components';

export default {
  name: 'opt-btn',
  props: {
    tooltip: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      required: true,
    },
  },
  components: {
    LsIcon,
  },
  methods: {
    handleClick() {
      this.$emit('action');
    },
  },
};
</script>

<style scoped></style>
