<template>
  <span>{{ nickname }}</span>
</template>

<script>
import { IMGetGroupMemberInfo } from '../../IM-SDK';

export default {
  name: 'Msg-lazy-nickname',
  props: {
    message: {
      type: Object,
      default: () => {},
      require: true,
    },
  },
  data() {
    return {
      nickname: '',
    };
  },
  mounted() {
    // TODO 缓存已查询到的昵称
    IMGetGroupMemberInfo(this.message.toUser, this.message.fromUser).then(
      (res) => {
        console.log(res, this.message.toUser, this.message)
        this.nickname = res?.data?.nickname;
      },
    );
  },
};
</script>

<style scoped></style>
