<template>
  <span>{{ messageTextType }}</span>
</template>

<script>
import { msgFormatMap } from '@lanshu/utils';

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
      return `${msgFormatMap[msgType]?.label(data)}`;
    },
  },
};
</script>

<style scoped></style>
