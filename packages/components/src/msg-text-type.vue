<template>
  <span>
    <span class="temp-msg" v-if="tempMsgText">
      <span class="label">[草稿]</span>
      <span>{{ tempMsgText }}</span>
    </span>
    <span v-else>{{ messageTextType }}</span>
  </span>
</template>

<script>
import { MSG_FORMAT_MAP } from '@lanshu/utils';

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
        };
      },
    },
  },
  computed: {
    messageTextType() {
      const { msgType, data } = this.lastMsg;
      if (!msgType && !data) return '暂无消息';
      const msgTypes = Object.keys(MSG_FORMAT_MAP);
      if (!msgTypes.includes(String(msgType))) return '未知消息';
      return `${MSG_FORMAT_MAP[msgType]?.label(data)}`;
    },
  },
  watch: {
    tempMsg: {
      deep: true,
      handler(val) {
        const preview = val?.preview;
        const timer = preview ? 100 : 1;
        setTimeout(() => {
          this.tempMsgText = this.tempMsg?.preview;
        }, timer);
      },
    },
  },
  data() {
    return {
      tempMsgText: '',
    };
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
