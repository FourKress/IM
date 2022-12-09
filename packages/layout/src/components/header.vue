<template>
  <div id="client-header">
    <div class="header_user">
      <div class="avatar">
        <img :src="userInfo.avatar" class="img" alt="" />
        <div class="status"></div>
      </div>
      <div class="user-info">
        <p class="name">{{ userInfo.nickname }}</p>
        <div class="position">
          <span>线上综窗</span>
          <span class="down-icon"></span>
        </div>
      </div>
    </div>

    <div class="hearer-search">
      <div class="search">
        <div class="query-icon">
          <LsIcon icon="navi_ss_icon" render-svg></LsIcon>
        </div>
        <div class="input-panel">
          <input type="text" placeholder="创建事项或搜索关键词" />
        </div>
        <div class="add">
          <LsIcon icon="navi_ss_add" render-svg></LsIcon>
        </div>
      </div>
    </div>

    <div class="header_action">
      <span class="btn small" @click="handleWindowChange('min')">
        <LsIcon icon="navi_zxh_icon" render-svg></LsIcon>
      </span>
      <span class="btn big" @click="handleWindowChange('max')">
        <LsIcon icon="navi_sx_icon" render-svg></LsIcon>
      </span>
      <!--      <span class="btn big" @click="handleWindowChange('full')"></span>-->
      <span class="btn close" @click="handleWindowChange('close')">
        <LsIcon icon="navi_gb_icon" render-svg></LsIcon>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LsIcon } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'MainHeader',
  components: {
    LsIcon,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
    ...mapGetters('globalStore', ['userError']),
  },
  methods: {
    handleWindowChange(type) {
      renderProcess.changeWindow(type);
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
  padding-bottom: 22px;
  box-sizing: border-box;

  -webkit-app-region: drag;

  .header_user {
    margin-left: 12px;
    display: flex;
    align-items: center;

    .avatar {
      width: 46px;
      height: 46px;
      position: relative;

      .img {
        border-radius: 6px;
        display: block;
        width: 100%;
        height: 100%;
      }

      .status {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #00cba8;
        position: absolute;
        right: -3px;
        bottom: -3px;
      }
    }

    .user-info {
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .name {
        font-size: 16px;
        font-weight: bold;
        color: $main-text-color;
        line-height: 22px;
      }

      .position {
        font-size: 14px;
        color: $minor-text-color;
        line-height: 20px;
        display: flex;
        align-items: center;

        .down-icon {
          width: 8px;
          height: 5px;
          margin-left: 6px;

          background-color: #333333;
        }
      }
    }

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

    .search {
      width: 500px;
      height: 48px;
      background-color: $bg-white-color;
      box-shadow: $bg-select-shadow;
      border-radius: 10px;
      padding: 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .query-icon {
        width: 18px;
        height: 18px;
      }

      .input-panel {
        flex: 1;
        height: 28px;
        padding: 0 8px;
        border-right: 1px solid $split-line-color;
        font-size: 14px;

        input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
        }

        input::placeholder {
          color: $tips-text-color;
          font-size: 14px;
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
    margin-right: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btn {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
