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
import AccountCenter from '../account-center';
import Notify from '../notify';
import File from '../file';
import Basic from '../basic';
import Privacy from '../privacy';
import HotKey from '../hot-key';
import Update from '../update';
import About from '../about';
import UserInfo from '../user-info.vue';
import { IMReceiptMessage } from '@lanshu/im';
import { lodash } from '@lanshu/utils';

export default {
  name: 'Settings-home',
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
        //   label: '关于北象',
        //   icon: 'sz_gy',
        // },
      ],
      navSelectKey: 'UserInfo',
      targetKey: '',
      isScrollMax: false,
      scrollView: null,
    };
  },
  computed: {
    ...mapGetters('globalStore', ['updateNotify']),
  },
  mounted() {
    this.scrollView = document.querySelector('.scroll-view');

    const observer = new IntersectionObserver(
      (entries) => {
        let realKey = '';
        this.isScrollMax = false;
        entries.forEach((entry) => {
          const { isIntersecting, target } = entry;
          // 进入可视区
          if (isIntersecting) {
            const { intersectionRatio, boundingClientRect } = entry;
            const { top } = boundingClientRect;
            const key = target.id.split('-')[0];

            if (intersectionRatio <= 0.25 && top <= 162) {
              realKey = key;
              return;
            }
            if (
              intersectionRatio <= 1 &&
              intersectionRatio >= 0.5 &&
              top <= 200
            ) {
              realKey = key;
              return;
            }
            if (key === this.navList.at(-1).key && intersectionRatio === 1) {
              this.isScrollMax = true;
            }
          }
        });

        if (realKey) {
          this.setNacSelectKey(realKey);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 0.85, 0.95, 1],
        root: this.scrollView,
      },
    );
    const childNodes = this.scrollView.childNodes;
    childNodes.forEach((element) => {
      observer.observe(element);
    });
  },
  methods: {
    handleRouterBack() {
      this.$router.back();
    },
    handleSelectNav(nav) {
      const { key } = nav;
      if (this.isScrollMax) {
        this.navSelectKey = key;
        this.isScrollMax = false;
      } else {
        this.targetKey = key;
      }
      this.$ScrollTo(document.querySelector(`#${key}-Card`), 50, {
        container: '.scroll-view',
        easing: 'linear',
        lazy: false,
        offset: 0,
        force: true,
        cancelable: true,
        x: false,
        y: true,
      });
    },

    setNacSelectKey: lodash.debounce(function (key) {
      if (this.targetKey && this.targetKey !== key) {
        this.navSelectKey = this.targetKey;
      } else {
        this.navSelectKey = key;
      }
      this.targetKey = '';
    }, 150),
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
      scroll-behavior: smooth;
      padding-right: 54px;
    }
  }
}
</style>
