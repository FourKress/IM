<template>
  <div class="settings">
    <div class="top">
      <div
        class="card"
        :class="$route.path === item.path && 'active'"
        v-for="(item, index) in breadCrumbs"
        :key="item.path"
      >
        <span class="card-icon"></span>
        <span class="label" @click="handleJump(item)">{{ item.title }}</span>
        <span class="close-icon" @click="handleRouterClose(item, index)"></span>
        <span class="before-mask"></span>
        <span class="before-bg"></span>
        <span class="after-mask"></span>
        <span class="after-bg"></span>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Settings',
  computed: {
    ...mapGetters('routerStore', ['breadCrumbs', 'historyMainPath']),
  },
  data() {
    return {
      settingsHomePath: '/settings/home',
    };
  },
  mounted() {},
  methods: {
    ...mapActions('routerStore', ['deleteBreadCrumb']),
    handleRouterBack() {
      this.$router.back();
    },
    handleRouterClose(tab, index) {
      if (this.breadCrumbs?.length === 1) {
        this.$router.push(this.historyMainPath);
        this.deleteBreadCrumb(tab);
      } else {
        const targetIndex = index === 0 ? index + 1 : index - 1;
        const backPath = this.breadCrumbs[targetIndex].path;
        this.deleteBreadCrumb(tab);
        if (this.$route.path === backPath) return;
        this.$router.push(backPath);
      }
    },
    handleJump(tab) {
      const path = tab.path;
      if (this.$route.path === path) return;
      this.$router.push(tab.path);
    },
  },
};
</script>

<style scoped lang="scss">
.settings {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  user-select: none;

  .top {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #f3f5f7;

    .card {
      width: 200px;
      height: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f3f5f7;
      border-radius: 10px 10px 0 0;
      position: relative;

      &.active {
        background-color: #fff;

        .before-mask {
          z-index: 5;
          background-color: #f3f5f7;
          left: -10px;
          border-radius: 0 0 10px 0;
          height: 100%;
        }
        .before-bg {
          z-index: 4;
          left: -10px;
          background-color: #fff;
          height: 100%;
        }

        .after-mask {
          z-index: 7;
          background-color: #fff;
          left: 0;
          top: 0;
          border-radius: 10px 0 0 0;
          height: 100%;
        }
        .after-bg {
          z-index: 6;
          background-color: #f3f5f7;
          left: 0;
          top: 0;
          height: 100%;
        }
      }

      &:not(.active) {
        background-color: #f3f5f7;

        &:before {
          background-color: #f3f5f7;
        }
      }

      &:before,
      &:after,
      .before-mask,
      .after-mask,
      .before-bg,
      .after-bg {
        position: absolute;
        content: '';
        width: 10px;
        height: 100%;
        bottom: 0;
      }

      &:before {
        z-index: 2;
        background-color: #fff;
        right: -10px;
      }

      &:after {
        z-index: 3;
        background-color: #f3f5f7;
        right: -10px;
        border-radius: 0 0 0 10px;
      }

      .label {
        flex: 1;
        font-size: 16px;
        font-weight: bold;
        color: $main-text-color;
        margin-left: 10px;
        cursor: pointer;
      }

      .card-icon {
        width: 20px;
        height: 18px;
        cursor: pointer;

        background-color: #333;
      }

      .close-icon {
        width: 12px;
        height: 12px;
        cursor: pointer;
        background-color: #333;
      }
    }
  }
}
</style>
