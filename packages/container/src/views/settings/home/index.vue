<template>
  <div class="main">
    <div class="nav">
      <div
        class="nav-item"
        :class="navSelectKey === nav.key && 'active'"
        v-for="nav in navList"
        :key="nav.label"
        @click="handleSelectNav(nav)"
      >
        <span class="nav-icon">
          <LsIcon render-svg :icon="nav.icon"></LsIcon>
        </span>
        <span class="text">{{ nav.label }}</span>
        <el-badge
          is-dot
          :hidden="!updateNotify"
          v-if="nav.key === 'Update'"
        ></el-badge>
      </div>
    </div>
    <div class="content">
      <div class="scroll-view">
        <UserInfo></UserInfo>
        <AccountCenter></AccountCenter>
        <!--        <Notify></Notify>-->
        <File></File>
        <Basic></Basic>
        <!--        <Privacy></Privacy>-->
        <HotKey></HotKey>
        <Update></Update>
        <!--        <About></About>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LsIcon } from '@lanshu/components';
import { ScrollToMixins } from '@lanshu/utils';
import AccountCenter from '../account-center';
import Notify from '../notify';
import File from '../file';
import Basic from '../basic';
import Privacy from '../privacy';
import HotKey from '../hot-key';
import Update from '../update';
import About from '../about';
import UserInfo from '../user-info.vue';

export default {
  name: 'Settings-home',
  mixins: [ScrollToMixins],
  components: {
    LsIcon,
    UserInfo,
    AccountCenter,
    Notify,
    File,
    Basic,
    Privacy,
    HotKey,
    Update,
    About,
  },
  data() {
    return {
      navList: [
        {
          key: 'UserInfo',
          label: '个人信息',
          icon: 'sz_zhzx',
        },
        {
          key: 'AccountCenter',
          label: '账号中心',
          icon: 'ls-icon-icon_gerenxinxi',
        },
        // {
        //   key: 'Notify',
        //   label: '通知',
        //   icon: 'sz_tz',
        // },
        {
          key: 'File',
          label: '文件',
          icon: 'sz_wj',
        },
        {
          key: 'Basic',
          label: '通用',
          icon: 'sz_ty',
        },
        // {
        //   key: 'Privacy',
        //   label: '隐私',
        //   icon: 'sz_ys',
        // },
        {
          key: 'HotKey',
          label: '快捷键',
          icon: 'a-icon_kuaijiejian2x',
        },
        {
          key: 'Update',
          label: '更新升级',
          icon: 'sz_gx',
        },
        // {
        //   key: 'About',
        //   label: '关于客户端',
        //   icon: 'sz_gy',
        // },
      ],
      navSelectKey: '',
    };
  },
  computed: {
    ...mapGetters('globalStore', ['updateNotify']),
  },
  mounted() {
    this.scrollView = '.scroll-view';
    this.navSelectKey = 'UserInfo';
    const scrollView = document.querySelector(this.scrollView);
    const lastKey = this.navList.at(-1).key;

    this.initScrollObserver(scrollView, lastKey, 162, 200);
  },
  methods: {
    handleRouterBack() {
      this.$router.back();
    },
    handleSelectNav(nav) {
      const { key } = nav;
      this.handleScrollTo(
        key,
        document.querySelector(`#${key}-Card`),
        this.scrollView,
      );
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  flex: 1;
  height: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;

  .nav {
    max-width: 400px;
    width: 200px;
    height: 100%;
    background: #f9fafc;
    padding: 20px;
    box-sizing: border-box;

    &-item {
      width: 100%;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 20px;
      box-sizing: border-box;
      cursor: pointer;

      .nav-icon {
        width: 18px;
        height: 18px;
        margin-right: 10px;
      }

      .text {
        font-size: 16px;
        color: $main-text-color;
      }

      &.active {
        background-color: $bg-select-color;
        border-radius: 6px;

        .text {
          color: $primary-color;
        }
      }

      ::v-deep .el-badge {
        transform: translate(6px, 6px);
      }
    }
  }

  .content {
    flex: 1;
    height: 100%;
    padding: 28px 0 0 54px;
    overflow: hidden;
    box-sizing: border-box;

    .scroll-view {
      height: 100%;
      overflow-y: auto;
      transform: translate3d(0, 0, 0);
      padding-right: 54px;
    }
  }
}
</style>
