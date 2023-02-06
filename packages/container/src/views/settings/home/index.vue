<template>
  <div class="main">
    <div class="nav">
      <div
        class="nav-item"
        :class="navSelectKey === nav.key && 'active'"
        v-for="nav in navList"
        @click="handleSelectNav(nav)"
      >
        <span class="nav-icon"></span>
        <span class="text">{{ nav.label }}</span>
      </div>
    </div>
    <div class="content">
      <div class="scroll-view">
        <AccountCenter></AccountCenter>
        <Notify></Notify>
        <File></File>
        <Basic></Basic>
        <Privacy></Privacy>
        <HotKey></HotKey>
        <Update></Update>
<!--        <About></About>-->
      </div>
    </div>
  </div>
</template>

<script>
import AccountCenter from '../account-center';
import Notify from '../notify';
import File from '../file';
import Basic from '../basic';
import Privacy from '../privacy';
import HotKey from '../hot-key';
import Update from '../update';
import About from '../about';

export default {
  name: 'Settings-home',
  components: {
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
          key: 'AccountCenter',
          label: '账号中心',
          icon: '',
        },
        {
          key: 'Notify',
          label: '通知',
          icon: '',
        },
        {
          key: 'File',
          label: '文件',
          icon: '',
        },
        {
          key: 'Basic',
          label: '通用',
          icon: '',
        },
        {
          key: 'Privacy',
          label: '隐私',
          icon: '',
        },
        {
          key: 'HotKey',
          label: '快捷键',
          icon: '',
        },
        {
          key: 'Update',
          label: '更新升级',
          icon: '',
        },
        // {
        //   key: 'About',
        //   label: '关于北象',
        //   icon: '',
        // },
      ],
      navSelectKey: 'AccountCenter',
      scrollTop: 0,
      scrollView: null,
    };
  },
  mounted() {
    this.scrollView = document.querySelector('.scroll-view');
    this.scrollView.addEventListener('scroll', this.scrollHandle, true);
  },
  methods: {
    handleRouterBack() {
      this.$router.back();
    },
    handleSelectNav(nav) {
      const { key } = nav;
      document.querySelector(`#${key}-Card`).scrollIntoView();
    },

    scrollHandle() {
      const scrollView = document.querySelector('.scroll-view');
      const { scrollTop } = scrollView;
      const isDown = this.scrollTop <= scrollTop;
      this.scrollTop = scrollTop;
      this.navList.forEach((d) => {
        const { key } = d;
        const offset = document
          .querySelector(`#${key}-Card`)
          .getBoundingClientRect();

        const {top, height} = offset;

        if (isDown && top <= 162) {
          this.$nextTick(() => {
            this.navSelectKey = key;
          })
          return
        }
        if (!isDown && top < 0 && top * -1 <= (height - 60) / 5 ) {
          this.$nextTick(() => {
            this.navSelectKey = key;
          })
        }
      });
    },
  },

  destroyed() {
    this.scrollView.removeEventListener('scroll', this.scrollHandle, true)
  },
};
</script>

<style scoped lang='scss'>
.main {
  flex: 1;
  height: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;

  .nav {
    width: 400px;
    height: 100%;
    background: #f9fafc;
    padding: 20px;
    box-sizing: border-box;

    &-item {
      width: 360px;
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
        background-color: #333;
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
