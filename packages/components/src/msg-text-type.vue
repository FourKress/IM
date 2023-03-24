<template>
  <span>{{ messageTextType }}</span>
</template>

<script>
import { msgFormatMap, checkMsgType } from '@lanshu/utils';

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
      // 文本类型的消息直接展示
      if (msgFormatMap[msgType].type === checkMsgType.isText) {
        return data.content;
      }
      // 其他类型消息动态处理
      return `${msgFormatMap[msgType]?.label(data)}`;
    },
  },
};
</script>

<style scoped></style>
