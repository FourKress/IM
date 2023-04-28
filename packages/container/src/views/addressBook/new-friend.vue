<template>
  <div class="new-friend">
    <div class="friend-list">
      <div
        class="item"
        v-for="item in friendList"
        :key="item.id"
        @click="(event) => handleFriend(item, event)"
      >
        <div class="left">
          <img class="img" :src="item.toAvatar" alt="" />
          <div class="info">
            <span class="name">{{ item.toNickname }}</span>
            <span class="tips">{{ item.message }}</span>
          </div>
        </div>
        <div
          class="btn"
          :class="item.state === FRIEND_AUTH_STATE.IS_AWAIT && 'active'"
        >
          {{
            item.state === FRIEND_AUTH_STATE.IS_AWAIT
              ? '去验证'
              : item.state === FRIEND_AUTH_STATE.IS_AGREE
              ? '已添加'
              : '已过期'
          }}
        </div>
      </div>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="config"
        @sendAuth="handleSendAuth"
        @sendMsg="handleSendMsg"
        @sendVideo="handleSendVideo"
        @sendAudio="handleSendAudio"
        @resetApply="handleResetApply"
        @update="queryFriendRequestNotice"
      ></LsFriendPanel>
    </LsCardDialog>
  </div>
</template>

<script>
import { LsCardDialog, LsFriendPanel } from '@lanshu/components';
import { FRIEND_AUTH_STATE, FriendMixins } from '@lanshu/utils';
import { mapGetters, mapActions } from 'vuex';
import {
  IMQueryFriendRequestNotice,
  IMGetUserProfile,
  IMGetOneFriend,
  IMClearFriendRequestNoticeUnreadCount,
} from '@lanshu/im';

export default {
  name: 'New-Friend',
  mixins: [FriendMixins],
  components: {
    LsCardDialog,
    LsFriendPanel,
  },
  data() {
    return {
      FRIEND_AUTH_STATE,
      friendList: [],
      config: {},
    };
  },
  computed: {
    ...mapGetters('IMStore', ['newFriendCount']),
  },
  mounted() {
    this.queryFriendRequestNotice();
    if (this.newFriendCount > 0) {
      IMClearFriendRequestNoticeUnreadCount().then(() => {
        this.setNewFriendCount(0);
      });
    }
  },
  methods: {
    ...mapActions('IMStore', ['setNewFriendCount']),

    handleResetApply() {
      this.config = {
        isExpired: false,
        isApply: true,
      };
    },

    queryFriendRequestNotice() {
      this.handleCloseDialog();
      IMQueryFriendRequestNotice(0).then((res) => {
        console.log(res);
        this.friendList = res?.data?.data;
      });
    },

    getConfig(state) {
      const configMap = {
        [FRIEND_AUTH_STATE.IS_AWAIT]: () => {
          return {
            isAuth: true,
          };
        },
        [FRIEND_AUTH_STATE.IS_AGREE]: () => {
          return {
            isPass: true,
          };
        },
        [FRIEND_AUTH_STATE.IS_EXPIRE]: () => {
          return {
            isExpired: true,
          };
        },
      };
      return configMap[state]();
    },

    async handleFriend(item, event) {
      const { toUser, state, message, id } = item;
      const config = this.getConfig(state);
      this.config = config;
      const userProfile = (await IMGetUserProfile(toUser))?.data || {};
      let friendInfo = {}
      if (state === FRIEND_AUTH_STATE.IS_AGREE) {
        friendInfo = (await IMGetOneFriend(toUser))?.data || {}
      }
      const {remark, desc} = friendInfo;
      this.openFriendDialog(
        {
          ...userProfile,
          remark, desc,
          message,
          noticeId: id,
        },
        event,
      );
    },
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

      &:hover {
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
