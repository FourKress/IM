<template>
  <span>{{ messageTextType }}</span>
</template>

<script>
import { MSG_FORMAT_MAP, CHECK_MSG_TYPE } from '@lanshu/utils';

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
      if (MSG_FORMAT_MAP[msgType]?.type === CHECK_MSG_TYPE.IS_TEXT) {
        return data.content.split('<br>')[0];
      }
      // 其他类型消息动态处理
      return `${MSG_FORMAT_MAP[msgType]?.label(data)}`;
    },
  },
};
</script>

<style scoped></style>
