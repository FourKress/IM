<template>
  <span class="msg">
    <span class="at-tag" v-if="isAtMe">[@你]</span>
    <span class="temp-msg" v-if="tempMsgText">
      <span class="label">[草稿]</span>
      <span>{{ tempMsgText }}</span>
    </span>
    <span class="msg-text" v-else v-html="messageText"></span>
  </span>
</template>

<script>
import {
  CHECK_MSG_TYPE,
  MSG_FORMAT_MAP,
  SESSION_USER_TYPE,
} from '@lanshu/utils';

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
    isAtMe: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    messageText() {
      const { msgType, data, fromNickname, toUserType } = this.lastMsg;
      if (!msgType && !data) return '暂无消息';
      const msgTypes = Object.keys(MSG_FORMAT_MAP);
      // 不满足消息类型时，默认未知消息
      if (!msgTypes.includes(String(msgType))) return '未知消息';
      const msgTypeInfo = MSG_FORMAT_MAP[msgType];
      const messageText = msgTypeInfo.label(data);
      const isSysTemNotify =
        msgTypeInfo.type === CHECK_MSG_TYPE.IS_SYSTEM_NOTIFY;
      const isGroup = toUserType === SESSION_USER_TYPE.IS_GROUP;
      if (isSysTemNotify || !isGroup) {
        return messageText;
      }
      return `${fromNickname}: ${messageText}`;
    },
  },
  watch: {
    tempMsg: {
      deep: true,
      handler(val) {
        const preview = val?.preview;
        // 存在草稿消息时，需要做延迟渲染，避免草稿消息的残留
        const timer = preview || this.tempMsgText === preview ? 300 : 1;
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
.msg {
  display: flex;
  align-items: center;

  .msg-text {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

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

  .at-tag {
    color: $minor-red-color;
  }
}
</style>
