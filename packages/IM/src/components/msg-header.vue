<template>
  <div class="top">
    <div class="left">
      <div class="img">
        <img :src="toAvatar" alt="" />
      </div>
      <div class="info">
        <span class="name">{{ session.nickname }}</span>
        <span class="tips">顶顶顶顶</span>
      </div>
    </div>
    <div class="right">
<!--      <div class="btn" @click="handleCloseSession">-->
<!--        <LsIcon render-svg icon="a-icon_sp2x"></LsIcon>-->
<!--      </div>-->
      <div class="btn">
        <LsIcon render-svg icon="a-icon_sp2x"></LsIcon>
      </div>
      <div class="btn">
        <LsIcon render-svg icon="a-icon_yy2x"></LsIcon>
      </div>
      <div class="btn">
        <el-dropdown trigger="click">
          <LsIcon render-svg icon="a-icon_more2x"></LsIcon>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div class="send-down-row" @click="createGroup">
                <LsIcon render-svg icon="pop_cd_cjql"></LsIcon>
                <span>创建群聊</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="send-down-row" @click="openSettings">
                <LsIcon render-svg icon="pop_cd_sz"></LsIcon>
                <span>设置</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { LsIcon } from '@lanshu/components';

export default {
  name: 'Msg-header',
  components: {
    LsIcon
  },
  computed: {
    session() {
      return this.$attrs.session;
    },
    toAvatar() {
      return this.session.avatar;
    },
  },
  methods: {
    ...mapActions('IMStore', ['removeSessionWindowList']),

    handleCloseSession() {
      if (this.isMainSession) return;
      this.removeSessionWindowList(this.session);
    },

    openSettings() {
      this.$emit('openSettings');
    },
    createGroup() {
      this.$emit('createGroup');
    },
  }
};
</script>

<style scoped lang='scss'>
.top {
  height: 66px;
  box-sizing: border-box;
  background-color: $bg-white-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  .left {
    flex: 1;
    display: flex;
    align-items: center;

    .img {
      display: block;
      width: 46px;
      height: 46px;
      border-radius: 6px;
      margin-right: 10px;
      overflow: hidden;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .name {
        font-size: 16px;
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

  .right {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn {
      margin-right: 20px;
      cursor: pointer;
      width: 16px;
      height: 16px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
