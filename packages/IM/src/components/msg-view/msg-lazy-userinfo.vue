<template>
  <span class="msg-card" :class="(isGroup && !isSelf) && 'is-group'">
    <div class="img">
      <img :src="isSelf ? userInfo.avatar : toAvatar" alt="" />
    </div>
    <div
      class="nickname"
      v-if="!isSelf && message.toUserType === SESSION_USER_TYPE.IS_GROUP"
    >
      <span>{{ nickname }}</span>
    </div>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import { SESSION_USER_TYPE } from '@lanshu/utils';

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
    message: {
      type: Object,
      default: () => {},
      require: true,
    },
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  data() {
    return {
      SESSION_USER_TYPE,
      nickname: '',
      toAvatar: '',
      isGroup: false,
    };
  },
  watch: {
    message() {
      this.initData();
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.isGroup = this.message.toUserType === SESSION_USER_TYPE.IS_GROUP
      if (
        !this.isSelf &&
        this.isGroup
      ) {
        this.nickname = this.message?.fromNickname;
        this.toAvatar = this.message?.fromAvatar;
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
  width: 50px;
  min-width: 50px;
  height: 50px;
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
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: $tips-text-color;
  position: absolute;
  left: 60px;
  top: -3px;
  z-index: 2;
}

.msg-card {
  position: relative;
}
</style>
