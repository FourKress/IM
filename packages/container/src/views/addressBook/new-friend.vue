<template>
  <div class="new-friend">
    <div class="friend-list">
      <div
        class="item"
        :class="item.id === 1 && 'active'"
        v-for="item in friendList"
        :key="item.id"
        @click="(event) => openFriendDialog(item, event)"
      >
        <div class="left">
          <img class="img" src="" alt="" />
          <div class="info">
            <span class="name">发送大</span>
            <span class="tips">sadjdja</span>
          </div>
        </div>
        <div class="btn" :class="item.id === 1 && 'active'">去验证</div>
      </div>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <FriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="config"
        @confirm="handleConfirm"
        @resetApply="handleResetApply"
      ></FriendPanel>
    </LsCardDialog>
  </div>
</template>

<script>
import { LsCardDialog } from '@lanshu/components';
import FriendPanel from './friend-panel.vue';
import mixins from './mixins';
export default {
  name: 'New-Friend',
  mixins: [mixins],
  components: {
    LsCardDialog,
    FriendPanel,
  },
  data() {
    return {
      friendList: [{ id: 1, nickname: '打赏' }, { id: 23 }, { id: 4345 }],
      config: {
        isPass: true,
      },
    };
  },
  methods: {
    handleConfirm() {
      this.showFriendDialog = false;
    },
    handleResetApply() {
      this.config = {
        isExpired: false,
        isApply: true
      }
    }
  },
};
</script>

<style scoped lang="scss">
.new-friend {
  padding: 20px 18px;
  width: 100%;
  box-sizing: border-box;

  .friend-list {
    display: flex;
    flex-direction: column;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      height: 72px;
      background: $bg-white-color;
      border-radius: 6px;
      padding: 10px 30px 10px 13px;
      overflow: hidden;
      position: relative;
      cursor: pointer;

      &:before {
        content: '';
        width: 100%;
        height: 0;
        border-bottom: 1px solid $split-line-color;
        left: 0;
        bottom: 0;
        position: absolute;
      }

      &.active {
        background: $bg-hover-grey-color;
      }

      .btn {
        font-size: 12px;
        color: $tips-text-color;

        &.active {
          color: $primary-hover-color;
        }
      }

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
