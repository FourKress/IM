<template>
  <span>{{ timesText }}</span>
</template>

<script>
import { timesTransform } from '@lanshu/utils';

export default {
  name: 'Times-transform',
  props: {
    timestamp: {
      type: [String, Number],
      default: '',
      require: true,
    },
  },
  computed: {
    timesText() {
      return timesTransform(this.timestamp);
    },
  },
};
</script>

<style scoped></style>
