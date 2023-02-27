<template>
  <div id="client-header">
    <div class="header_user">
      <div class="avatar" @click="openDialog">
        <img :src="userInfo.avatar" class="img" alt="" />
      </div>
      <!--      <div class="user-info">-->
      <!--        <p class="name">{{ userInfo.nickname }}</p>-->
      <!--        <div class="position">-->
      <!--          <span>线上综窗</span>-->
      <!--          <span class="down-icon"></span>-->
      <!--        </div>-->
      <!--      </div>-->

      <div class="loading">
        {{ IM_Status }}
      </div>
    </div>

    <div class="hearer-search drag">
      <div class="search">
        <div class="query-icon">
          <LsIcon icon="navi_ss_icon" render-svg></LsIcon>
        </div>
        <div class="input-panel">
          <el-input
            v-model="keywords"
            clearable
            type="text"
            placeholder="创建事项或搜索关键词"
          />
        </div>
        <div class="add">
          <LsIcon icon="navi_ss_add" render-svg></LsIcon>
        </div>
      </div>
    </div>

    <div class="header_action">
      <WindowOperate />
    </div>

    <LsCardDialog :visible.sync="showSettingsDialog">
      <div class="settings-dialog">
        <div class="top"></div>
        <div class="info">
          <div class="avatar">
            <img :src="userInfo.avatar" class="img" />
          </div>
          <div class="nickname">{{ userInfo.nickname }}</div>
          <div class="tag"></div>
        </div>
        <div class="nav-wrap">
          <div class="row split">
            <span class="label">个人信息</span>
          </div>
          <div class="row">
            <span class="label" @click="goToSettings">设置</span>
          </div>
          <div class="row">
            <span class="label">下载手机版</span>
          </div>
          <div class="row">
            <span class="label">帮助与客服</span>
          </div>
          <div class="row split">
            <span class="label">关于北象</span>
          </div>
          <div class="row disabled">
            <span class="label" @click="handleLogOut">退出北象</span>
          </div>
        </div>
      </div>
    </LsCardDialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { LsIcon, WindowOperate, LsCardDialog } from '@lanshu/components';
import { ClientLogOut } from '@lanshu/utils';

export default {
  name: 'MainHeader',
  components: {
    LsIcon,
    WindowOperate,
    LsCardDialog,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'IM_Status']),
  },
  data() {
    return {
      showSettingsDialog: false,
      keywords: '',
    };
  },
  mounted() {},
  methods: {
    ...mapActions('routerStore', [
      'clearBreadCrumb',
      'addBreadCrumbs',
      'setHistoryMainPath',
    ]),
    openDialog() {
      this.showSettingsDialog = true;
    },
    goToSettings() {
      this.showSettingsDialog = false;
      if (this.$route.path.includes('/settings')) return;
      this.setHistoryMainPath(this.$route.path);
      this.clearBreadCrumb();
      this.addBreadCrumbs({
        title: '设置',
        path: '/settings/home',
      });

      this.$router.push('/settings');
    },
    async handleLogOut() {
      this.showSettingsDialog = false;

      await ClientLogOut();
      await this.$router.push('/login');
    },
  },
};
</script>

<style scoped lang="scss">
#client-header {
  width: 100%;
  height: 90px;
  min-height: 90px;
  background: $gradient-header-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 22px 12px;
  box-sizing: border-box;

  .header_user {
    display: flex;
    align-items: center;

    .avatar {
      width: 46px;
      height: 46px;
      cursor: pointer;

      .img {
        border-radius: 6px;
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    //.user-info {
    //  margin-left: 12px;
    //  display: flex;
    //  flex-direction: column;
    //  justify-content: center;
    //  align-items: flex-start;
    //
    //  .name {
    //    font-size: 16px;
    //    font-weight: bold;
    //    color: $main-text-color;
    //    line-height: 22px;
    //  }
    //
    //  .position {
    //    font-size: 14px;
    //    color: $minor-text-color;
    //    line-height: 20px;
    //    display: flex;
    //    align-items: center;
    //
    //    .down-icon {
    //      width: 8px;
    //      height: 5px;
    //      margin-left: 6px;
    //
    //      background-color: #333333;
    //    }
    //  }
    //}

    .loading {
      margin-left: 24px;
      color: $tips-text-color;
    }
  }

  .hearer-search {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    &.drag {
      -webkit-app-region: drag !important;
    }

    &.no-drag {
      -webkit-app-region: no-drag !important;
    }

    .search {
      width: 500px;
      height: 48px;
      background-color: $bg-white-color;
      box-shadow: $bg-select-shadow;
      border-radius: 10px;
      padding: 0 18px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;

      -webkit-app-region: no-drag;

      .query-icon {
        width: 18px;
        height: 18px;
      }

      .input-panel {
        flex: 1;
        height: 40px;
        padding: 0 8px;
        border-right: 1px solid $split-line-color;
        font-size: 14px;

        ::v-deep .el-input {
          border: none;
          height: 40px;

          .el-input__inner {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            padding: 0 30px 0 0;
          }

          input::placeholder {
            color: $tips-text-color;
            font-size: 14px;
          }
        }
      }

      .add {
        width: 18px;
        height: 18px;
        cursor: pointer;
        margin-left: 17px;
      }
    }
  }

  .header_action {
    position: relative;
    width: 90px;
    height: 20px;
  }
}

.settings-dialog {
  width: 372px;
  height: 517px;
  background: $bg-white-color;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border-radius: 12px;
  border: 1px solid $split-line-color;
  overflow: hidden;
  position: fixed;
  top: 10px;
  left: 71px;
  z-index: 9;

  .top {
    width: 100%;
    height: 110px;
    background: url('../assets/images/top-bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 30px 0 24px;
    margin: -29px 0 34px 0;

    .avatar {
      border-radius: 16px;
      border: 6px solid #ffffff;
      margin-right: 14px;

      .img {
        width: 66px;
        height: 66px;
        background: #ffb100;
        border-radius: 8px;
        display: block;
      }
    }

    .nickname {
      flex: 1;
      font-size: 18px;
      font-weight: bold;
      color: $main-text-color;
      margin-bottom: 6px;
    }

    .tag {
      width: 53px;
      height: 18px;
      border-radius: 2px;
      opacity: 0.5;
      border: 1px solid $minor-color;
      margin-bottom: 6px;
    }
  }

  .nav-wrap {
    padding: 0 40px;

    .row {
      margin-top: 20px;
      box-sizing: border-box;
      font-size: 14px;
      color: $main-text-color;

      .label {
        cursor: pointer;
      }

      &.split:after {
        content: '';
        display: block;
        width: 100%;
        border-bottom: 1px solid $split-line-color;
        margin: 26px 0;
      }

      &.disabled {
        font-size: 14px;
        color: $tips-text-color;
      }
    }
  }
}
</style>
