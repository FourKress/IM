<template>
  <span class="msg-card">
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
      if (
        !this.isSelf &&
        this.message.toUserType === SESSION_USER_TYPE.IS_GROUP
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

  &:before {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 5px;
    content: ' ';
    width: 0;
    height: 0;

  }

  &.self {
    &:before {
      left: 0;
      border-width: 5px 0 5px 5px;
      border-style: solid;
      border-color: transparent $bubble-IM-color transparent;
    }
  }

  &.target {
    &:before {
      right: 0;
      border-width: 5px 5px 5px 0;
      border-style: solid;
      border-color: transparent $bg-white-color transparent;
    }
  }
}
</style>
