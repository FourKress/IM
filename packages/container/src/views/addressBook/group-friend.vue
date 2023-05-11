<template>
  <div class="group-friend">
    <GroupList :list="myGroupList" title="我创建的群聊"></GroupList>
    <GroupList :list="joinGroupList" title="我加入的群聊"></GroupList>
  </div>
</template>

<script>
import { IMGetGroupList } from '@lanshu/im';
import { mapGetters } from 'vuex';
import GroupList from './group-list.vue';

export default {
  name: 'Group-Friend',
  components: {
    GroupList,
  },
  data() {
    return {
      myGroupList: [],
      joinGroupList: [],
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    async getGroupList() {
      const res = await IMGetGroupList();
      const groupList = res?.data || [];
      groupList.forEach((d) => {
        if (d.owner === this.userInfo.userId) {
          this.myGroupList.push(d);
        } else {
          this.joinGroupList.push(d);
        }
      });
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
</style>
