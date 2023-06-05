<template>
  <div class="group-friend" v-if="myGroupList.length || joinGroupList.length">
    <GroupList :list="myGroupList" title="我创建的群聊"></GroupList>
    <GroupList :list="joinGroupList" title="我加入的群聊"></GroupList>
  </div>

  <div class="empty-data" v-else>
    <img :src="LsAssets.emptyDataBook" alt="" />
  </div>
</template>

<script>
import { IMGetGroupList } from '@lanshu/im';
import { LsAssets } from '@lanshu/components';
import { mapGetters } from 'vuex';
import GroupList from './group-list.vue';

export default {
  name: 'Group-Friend',
  components: {
    GroupList,
  },
  data() {
    return {
      LsAssets,
      groupList: [],
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'userNicknameAvatarUpdate']),

    myGroupList() {
      return this.groupList.filter((d) => d.owner === this.userInfo.userId);
    },
    joinGroupList() {
      return this.groupList.filter((d) => d.owner !== this.userInfo.userId);
    },
  },
  watch: {
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
}

.empty-data {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 200px;
    height: 200px;
  }
}
</style>
