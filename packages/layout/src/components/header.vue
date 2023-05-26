<template>
  <div id="client-header" class="drag">
    <div class="header_user">
      <el-badge is-dot :hidden="!updateNotify">
        <div class="avatar" @click="openDialog">
          <img :src="userProfile.avatar" class="img" alt="" />
        </div>
      </el-badge>
      <!--      <div class="user-info">-->
      <!--        <p class="name">{{ userInfo.nickname }}</p>-->
      <!--        <div class="position">-->
      <!--          <span>线上综窗</span>-->
      <!--          <span class="down-icon"></span>-->
      <!--        </div>-->
      <!--      </div>-->

      <div class="network_status">
        <LsNetwork />
      </div>
    </div>

    <div class="hearer-search">
      <div class="search" @click="handleSearch">
        <div class="query-icon">
          <LsIcon icon="navi_ss_icon" render-svg></LsIcon>
        </div>
        <div class="input-panel">
          <el-input
            v-model="keywords"
            readonly
            clearable
            type="text"
            placeholder="搜索"
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
        <div class="top">
          <img :src="LsAssets.topBg" alt="" />
        </div>
        <div class="info">
          <div class="avatar">
            <img :src="userProfile.avatar" class="img" />
          </div>
          <div class="sub-info">
            <div class="nickname">{{ userProfile.nickname }}</div>
            <!--            <span class="auth-tag">-->
            <!--              <LsIcon-->
            <!--                render-svg-->
            <!--                class="tag-icon"-->
            <!--                icon="a-icon_yzcg2x"-->
            <!--                height="12"-->
            <!--                width="12"-->
            <!--              ></LsIcon>-->
            <!--              <span>已实名</span>-->
            <!--            </span>-->
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
            <el-badge
              is-dot
              :hidden="!updateNotify"
            ></el-badge>
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

    <LsCardDialog :visible.sync="showQrCodeDialog">
      <LsQrcodePanel
        :position="{
          left: '450px',
          top: '10px',
        }"
        tips="添加我为联系人"
        :qrcodeInfo="{
          ...userInfo,
          qrcodeId: userInfo.userId,
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
      this.showQrCodeDialog = true;
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
  height: 90px;
  min-height: 90px;
  background: $gradient-header-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 22px 12px;
  box-sizing: border-box;
  position: relative;

  &.drag {
    -webkit-app-region: drag !important;
  }

  &.no-drag {
    -webkit-app-region: no-drag !important;
  }

  .header_user {
    display: flex;
    align-items: center;
    position: relative;
    -webkit-app-region: no-drag !important;

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

    .network_status {
      position: absolute;
      top: 0;
      right: -345px;
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
        cursor: pointer;

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
    width: 102px;
    height: 24px;
    -webkit-app-region: no-drag !important;
  }
}

.settings-dialog {
  width: 372px;
  height: 570px;
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

      &:hover {
        background: $bg-hover-grey-color;
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
