<template>
  <span
    class="msg-card"
    :class="[
      isSelf && bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN
        ? 'self'
        : 'target',
      isGroup && !isSelf && 'is-group',
    ]"
  >
    <div class="img">
      <img :src="isSelf ? userInfo.avatar : toAvatar" alt="" />
    </div>
    <div
      class="nickname"
      v-if="!isSelf && rawMsg.toUserType === SESSION_USER_TYPE.IS_GROUP"
    >
      <span>{{ nickname }}</span>
    </div>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import { SESSION_USER_TYPE, SESSION_BUBBLE_MODEL } from '@lanshu/utils';

export default {
  name: 'Msg-lazy-userInfo',
  props: {
    isSelf: {
      type: Boolean,
      required: true,
    },
    session: {
      type: Object,
      default: () => {},
      require: true,
    },
    rawMsg: {
      type: Object,
      default: () => {},
      require: true,
    },
    bubbleModel: {
      type: [Number, String],
      default: SESSION_BUBBLE_MODEL.IS_BETWEEN,
    },
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  data() {
    return {
      SESSION_BUBBLE_MODEL,
      SESSION_USER_TYPE,
      nickname: '',
      toAvatar: '',
      isGroup: false,
    };
  },
  watch: {
    rawMsg() {
      this.initData();
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.isGroup = this.rawMsg.toUserType === SESSION_USER_TYPE.IS_GROUP;
      if (!this.isSelf && this.isGroup) {
        this.nickname = this.rawMsg?.fromNickname;
        this.toAvatar = this.rawMsg?.fromAvatar;
      } else {
        this.toAvatar = this.session.avatar;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.self {
  flex-flow: row-reverse;
  .img {
    margin-left: 10px;
  }
}

.target {
  .img {
    margin-right: 10px;
  }
}

.img {
  width: 32px;
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}

.nickname {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: $tips-text-color;
  position: absolute;
  left: 42px;
  top: -3px;
  z-index: 2;
}

.msg-card {
  position: relative;
}
</style>
