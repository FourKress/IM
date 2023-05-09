<template>
  <span>
    <div class="img">
      <img :src="isSelf ? userInfo.avatar : toAvatar" alt="" />
    </div>
    <div class="nickname" v-if="!isSelf && message.toUserType === SESSION_USER_TYPE.IS_GROUP">
      <span>{{ nickname }}</span>
    </div>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import { SESSION_USER_TYPE } from '@lanshu/utils';
import { IMGetGroupMemberInfo } from '../../IM-SDK';

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
  mounted() {
    // TODO 缓存已查询到的昵称、头像
    if (!this.isSelf && this.message.toUserType === SESSION_USER_TYPE.IS_GROUP) {
      IMGetGroupMemberInfo(this.message.toUser, this.message.fromUser).then(
        (res) => {
          const { nickname, avatar } = res?.data || {};
          console.log('IMGetGroupMemberInfo', nickname, avatar, this.message.fromUser);
          this.nickname = nickname;
          this.toAvatar = avatar;
        },
      );
    } else {
      this.toAvatar = this.session.avatar;
    }
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
  font-size: 12px;
  color: $tips-text-color;
  position: absolute;
  left: 60px;
  top: -3px;
  z-index: 2;
}
</style>
