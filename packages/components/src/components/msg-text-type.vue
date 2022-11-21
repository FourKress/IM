<template>
  <span>{{ messageTextType }}</span>
</template>

<script>
import { msgTypeMap } from '@lanshu/utils';

export default {
  name: 'Msg-text-type',
  props: {
    lastMsg: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    messageTextType() {
      const { msgType, data } = this.lastMsg;
      if (msgType === 1) {
        return data.content;
      }
      return `[${msgTypeMap[msgType]}]`;
    },
  },
};
</script>

<style scoped></style>
