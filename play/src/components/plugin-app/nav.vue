<template>
  <div class="plugin-app-nav">
    <div class="title">应用</div>
    <div class="container">
      <div
        class="item"
        :class="activeKey === item.key && 'active'"
        v-for="item in microAppList"
        :key="item.key"
        @click="handleOpenApp(item)"
      >
        <img class="icon" src="./logo.jpg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'PluginAppNav',
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow']),
  },
  data() {
    return {
      activeKey: '',
      microAppList: [
        {
          key: 'SelfPlugin',
        },
        {
          key: 'SelfPluginB',
        },
      ],
    };
  },
  watch: {
    mainSessionWindow: {
      deep: true,
      handler() {
        this.openAppNav();
      },
    },
  },
  mounted() {
    this.openAppNav();
    this.$emit('update:pluginStyle', {
      flex: '1 1 0',
      minWidth: '60px',
      maxWidth: '60px',
    });
  },
  methods: {
    ...mapActions('globalStore', ['setOpenMicroApp']),

    openAppNav() {
      if (this.mainSessionWindow?.sessId && !this.visible) {
        this.setOpenMicroApp({
          appName: 'PluginAppNav',
          visible: true,
        });
      }
    },

    handleOpenApp(item) {
      this.activeKey = item.key;
      this.setOpenMicroApp({
        appName: item.key,
        visible: true,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.plugin-app-nav {
  width: 60px;
  max-width: 60px;
  min-width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-white-color;
  position: relative;

  .title {
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    color: $main-text-color;
    font-weight: bold;
    border-bottom: 1px solid $split-line-color;
  }

  .container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .item {
      width: 50px;
      height: 50px;
      min-height: 50px;
      background-color: $bg-white-color;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      cursor: pointer;
      overflow: hidden;

      .icon {
        display: block;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        overflow: hidden;
      }

      &.active {
        background-color: #e9f2ff;
        &:hover {
          background-color: #e9f2ff;
        }
      }

      &:hover {
        background-color: $bg-hover-grey-color;
      }
    }
  }
}
</style>
