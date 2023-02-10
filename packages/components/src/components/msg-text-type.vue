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
      if (!msgType && !data) return '暂无消息';
      if (msgType === 1) {
        return data.content;
      }
      return `[${msgTypeMap[msgType]?.label}]`;
    },
  },
};
</script>

<style scoped></style>
