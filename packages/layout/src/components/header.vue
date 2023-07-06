<template>
  <div id="client-header">
    <div id="header-container" class="drag">
      <div class="header_user">
        <el-badge is-dot :hidden="!updateNotify">
          <div class="avatar" @click="openDialog">
            <img :src="userProfile.avatar" class="img" alt="" />
          </div>
        </el-badge>

        <div class="network_status">
          <LsNetwork />
        </div>
      </div>

      <div class="hearer-search">
        <div class="search" @click="handleSearch">
          <LsIcon
            icon="navi_ss_icon"
            width="14"
            height="14"
            render-svg
          ></LsIcon>
          <div class="input-panel">
            <el-input
              v-model="keywords"
              readonly
              clearable
              type="text"
              placeholder="搜索"
            />
          </div>
        </div>
      </div>

      <div class="header_action">
        <WindowOperate />
      </div>
    </div>

    <LsCardDialog :visible.sync="showSettingsDialog">
      <div class="settings-dialog">
        <div class="top">
          <img :src="LsAssets.cardTopBg" alt="" />
        </div>
        <div class="info">
          <div class="avatar">
            <img :src="userProfile.avatar" class="img" />
          </div>
          <div class="sub-info">
            <div class="nickname">{{ userProfile.nickname }}</div>
          </div>
          <div class="more">
            <LsIcon
              class=""
              :color="showQrCodeDialog ? '#0066ff' : '#999999'"
              size="13"
              icon="ls-icon-icon_erweima"
              @click="showQrCode"
            ></LsIcon>
          </div>
        </div>

        <div class="tag-wrap">
          <LsUserTag
            :age="calculateAgeByBirthday(userProfile.birthday)"
            :sex="userProfile.sex"
            :address="userProfile.location"
          ></LsUserTag>
        </div>

        <div class="sign">
          <el-input
            type="text"
            placeholder="编辑你的个性签名…"
            v-model="description"
            maxlength="50"
            show-word-limit
            @change="handleSetSign"
          ></el-input>
        </div>

        <div class="nav-wrap">
          <div class="row split">
            <span class="label" @click="goToSettings">个人信息</span>
          </div>
          <div class="row">
            <span class="label" @click="goToSettings">设置</span>
            <el-badge is-dot :hidden="!updateNotify"></el-badge>
          </div>
          <div class="row disabled">
            <span class="label" @click="handleLogOut">退出北象</span>
          </div>
        </div>
      </div>

      <LsQrcodePanel
        v-if="showQrCodeDialog"
        :position="{
          left: '442px',
          top: '12px',
        }"
        tips="添加我为联系人"
        :qrcodeInfo="{
          ...userInfo,
          qrcodeId: userInfo.userId,
          qrcodeType: 'user',
        }"
      />
    </LsCardDialog>

    <LsSearchPanel :visible.sync="visibleSearch"></LsSearchPanel>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  LsIcon,
  WindowOperate,
  LsCardDialog,
  LsAssets,
  LsNetwork,
  LsUserTag,
  LsQrcodePanel,
  LsSearchPanel,
} from '@lanshu/components';
import { ClientLogOut, IMSetUserProfile } from '@lanshu/im';
import { calculateAgeByBirthday } from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'MainHeader',
  components: {
    LsIcon,
    WindowOperate,
    LsCardDialog,
    LsNetwork,
    LsUserTag,
    LsQrcodePanel,
    LsSearchPanel,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'userProfile']),
    ...mapGetters('globalStore', ['updateNotify']),
  },
  data() {
    return {
      showSettingsDialog: false,
      keywords: '',
      LsAssets,
      description: '',
      showQrCodeDialog: false,
      qrcodeUrl: '',
      visibleSearch: false,
    };
  },
  watch: {
    userProfile: {
      deep: true,
      handler() {
        this.initData();
      },
    },
  },
  created() {
    renderProcess.activeSearch((event) => {
      this.visibleSearch = true;
    });
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions('IMStore', ['setUserProfile']),
    ...mapActions('routerStore', [
      'clearBreadCrumb',
      'addBreadCrumbs',
      'setHistoryMainPath',
    ]),
    calculateAgeByBirthday,

    initData() {
      this.description = this.userProfile?.description;
    },
    openDialog() {
      this.showQrCodeDialog = false;
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
      try {
        await ClientLogOut();
        await this.$router.push('/login');
      } catch (e) {}
    },

    showQrCode() {
      this.showQrCodeDialog = !this.showQrCodeDialog;
    },

    async handleSetSign(val) {
      const {
        sex = '',
        birthday = '',
        location = '',
        phone = '',
      } = this.userProfile;
      const res = await IMSetUserProfile(
        val ? val : '',
        sex,
        birthday,
        location,
        phone,
      );
      await this.setUserProfile(res.data);
    },

    handleSearch() {
      this.visibleSearch = true;
    },
  },
};
</script>

<style scoped lang="scss">
#client-header {
  width: 100%;
  height: 70px;
  min-height: 70px;
  background: $gradient-header-color;
  padding-bottom: 14px;
  box-sizing: border-box;
  position: relative;

  #header-container {
    height: 56px;
    box-sizing: border-box;
    padding: 0 10px 0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.drag {
      -webkit-app-region: drag !important;
    }

    &.no-drag {
      -webkit-app-region: no-drag !important;
    }
  }

  .header_user {
    display: flex;
    align-items: center;
    position: relative;

    transform: translateY(4px);

    -webkit-app-region: no-drag !important;

    .avatar {
      width: 40px;
      height: 40px;
      cursor: pointer;

      .img {
        border-radius: 6px;
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .network_status {
      position: absolute;
      top: 0;
      right: -174px;
    }
  }

  .hearer-search {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    -webkit-app-region: no-drag !important;

    .search {
      width: 500px;
      height: 36px;
      background-color: $bg-white-color;
      box-shadow: $bg-select-shadow;
      border-radius: 20px;
      padding: 0 18px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;

      -webkit-app-region: no-drag;

      .input-panel {
        flex: 1;
        height: 36px;
        padding: 0 8px;
        font-size: 14px;
        cursor: pointer;

        ::v-deep .el-input {
          border: none;
          height: 36px;

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
    }
  }

  .header_action {
    position: relative;
    width: 136px;
    height: 24px;
    -webkit-app-region: no-drag !important;
  }
}

.settings-dialog {
  width: 372px;
  height: 420px;
  background: $bg-white-color;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border-radius: 12px;
  border: 1px solid $split-line-color;
  overflow: hidden;
  position: fixed;
  top: 12px;
  left: 64px;
  z-index: 9;

  .top {
    width: 100%;
    height: 110px;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .tag-wrap {
    margin-left: 30px;
  }

  .sign {
    margin: 17px 15px;

    ::v-deep .el-input__inner {
      border: none;
      background: transparent;
      background: $bg-hover-grey-color;

      &:hover {
        background: #eee;
      }
    }

    ::v-deep .el-input__count-inner {
      background: transparent;
    }
  }

  .nav-wrap {
    padding: 0 30px;

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
        margin: 22px 0;
      }

      &.disabled {
        font-size: 14px;
        color: $tips-text-color;
      }

      ::v-deep .el-badge {
        transform: translate(6px, 4px);
      }
    }
  }

  .info {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 0 30px 0 24px;
    margin: -29px 0 17px 0;

    .avatar {
      border-radius: 16px;
      border: 6px solid #ffffff;
      margin-right: 14px;

      .img {
        width: 66px;
        height: 66px;
        border-radius: 8px;
        display: block;
      }
    }

    .sub-info {
      flex: 1;
      display: flex;
      align-items: center;
      max-width: 211px;
      margin-bottom: 6px;

      .nickname {
        max-width: 140px;
        font-size: 18px;
        font-weight: bold;
        color: $main-text-color;
        margin-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .auth-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 53px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid $minor-color;
        text-align: center;
        font-size: 11px;
        color: $minor-color;
        line-height: 18px;

        .tag-icon {
          margin-right: 2px;
        }
      }
    }

    .more {
      margin-bottom: 6px;
      cursor: pointer;
    }
  }
}
</style>
