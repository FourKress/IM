<template>
  <div class="row">
    <div class="title">{{title}}（{{ list.length }}）</div>
    <div class="list">
      <div
        class="item"
        v-for="item in list"
        :key="item.id"
        @click="handleJumpGroup(item)"
      >
        <div class="left">
          <img class="img" :src="item.avatar" alt="" />
          <div class="info">
            <span class="name">{{ item.nickname }}</span>
            <!--              <span class="tips">sadjdja</span>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMGetByUserId } from '@lanshu/im';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Group-list',
  props: {
    list: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('IMStore', ['sessionList']),
  },
  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),

    async startSession(userId) {
      let session;
      const storeSession = this.sessionList.find((d) => d.toUser === userId);
      if (storeSession) {
        session = storeSession;
      } else {
        const res = await IMGetByUserId(userId);
        if (!res?.data) return;
        session = res.data;
      }
      await this.setMainSessionWindow(session);
    },
    async handleJumpGroup(group) {
      const { groupId } = group;
      await this.startSession(groupId);
      this.$router.push('/');
    },
  },
};
</script>

<style scoped lang="scss">
.row {
  .title {
    font-size: 12px;
    color: $minor-text-color;
    margin: 20px 0 12px;
  }

  .list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      height: 48px;
      background: $bg-white-color;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      margin-bottom: 16px;

      .left {
        display: flex;
        align-items: center;

        .img {
          display: block;
          width: 46px;
          height: 46px;
          border-radius: 6px;
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding-left: 8px;

          .name {
            font-size: 14px;
            font-weight: bold;
            color: $main-text-color;
            margin-bottom: 5px;
          }

          .tips {
            font-size: 12px;
            color: $tips-text-color;
          }
        }
      }
    }
  }
}
</style>
