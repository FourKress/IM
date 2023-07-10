<template>
  <div class="group-friend" v-if="myGroupList.length || joinGroupList.length">
    <GroupList :list="myGroupList" title="我创建的群聊"></GroupList>
    <GroupList :list="joinGroupList" title="我加入的群聊"></GroupList>
  </div>

  <LsEmptyData
    v-else
    :imgSrc="LsAssets.notFriend"
    tips="暂无群聊"
  ></LsEmptyData>
</template>

<script>
import { IMGetGroupList } from '@lanshu/im';
import { LsAssets, LsEmptyData } from '@lanshu/components';
import { mapGetters } from 'vuex';
import GroupList from './group-list.vue';

export default {
  name: 'Group-Friend',
  components: {
    GroupList,
    LsEmptyData,
  },
  data() {
    return {
      LsAssets,
      groupList: [],
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'userNicknameAvatarUpdate']),
    // 我创建的群聊
    myGroupList() {
      return this.groupList.filter((d) => d.owner === this.userInfo.userId);
    },
    // 我加入的群聊
    joinGroupList() {
      return this.groupList.filter((d) => d.owner !== this.userInfo.userId);
    },
  },
  watch: {
    // 群头像昵称更改通知
    userNicknameAvatarUpdate() {
      this.getGroupList();
    },
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    async getGroupList() {
      const res = await IMGetGroupList();
      this.groupList = res?.data || [];
    },
  },
};
</script>

<style scoped lang="scss">
.group-friend {
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
  height: 100%;
  overflow-y: auto;
  position: relative;
}
</style>
