<template>
  <span>
    <span class="temp-msg" v-if="tempMsg.preview">
      <span class="label">[草稿]</span>
      <span>{{ tempMsg.preview }}</span>
    </span>
    <span v-else>{{ messageTextType }}</span>
  </span>
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
    tempMsg: {
      type: Object,
      default: () => {
        return {
          preview: '',
        }
      },
    },
  },
  computed: {
    messageTextType() {
      const { msgType, data } = this.lastMsg;
      if (!msgType && !data) return '暂无消息';
      const msgTypes = Object.keys(MSG_FORMAT_MAP);
      if (!msgTypes.includes(String(msgType))) return '未知消息';
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

<style scoped lang="scss">
.temp-msg {
  display: block;
  width: 145px;
  height: 17px;
  font-size: 12px;
  color: $tips-text-color;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .label {
    color: $minor-red-color;
  }
}
</style>
