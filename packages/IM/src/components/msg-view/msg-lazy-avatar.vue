<template>
  <img :src="isSelf ? userInfo.avatar : toAvatar" alt="" />
</template>

<script>
import { mapGetters } from 'vuex';
import { SESSION_USER_TYPE } from '@lanshu/utils';
import { IMGetUserAttribute } from '../../IM-SDK';

export default {
  name: 'Msg-lazy-avatar',
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
    }
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  data() {
    return {
      toAvatar: '',
    };
  },
  mounted() {
    // TODO 缓存已查询到的头像
    if (this.message.toUserType === SESSION_USER_TYPE.IS_GROUP) {
      IMGetUserAttribute(this.message.fromUser).then((res) => {
        this.toAvatar = res?.data?.avatar;
      })
    } else {
      this.toAvatar = this.session.avatar;
    }
  },
};
</script>

<style scoped></style>
