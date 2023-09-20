<template>
  <div class="plugin-app-header">
    <div class="left">
      <LsIcon
        size="14"
        color="#333"
        icon="ls-icon-shuaxin"
        @click="handleUpdate"
      ></LsIcon>
    </div>
    <div class="title">
      {{ appTitle }}
    </div>
    <div class="right">
      <LsIcon
        size="12"
        color="#333"
        icon="ls-icon-guanbi"
        @click="handleClose"
      ></LsIcon>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { RightPluginVisibleHistoryMixins } from '@lanshu/utils';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'PluginAppHeader',
  mixins: [RightPluginVisibleHistoryMixins],
  props: {
    appKey: {
      type: String,
      default: '',
      required: true,
    },
  },
  components: { LsIcon },
  computed: {
    ...mapGetters('globalStore', ['microAppList']),

    appTitle() {
      const app = this.microAppList.find((d) => d.key === this.appKey) || {};
      return app?.title;
    },
  },
  watch: {
    mapGetters() {},
  },
  mounted() {},
  methods: {
    ...mapActions('globalStore', ['setCurrentMicroApp']),

    async handleClose() {
      this.$emit('close');

      const visible = false;
      const appKey = this.appKey;
      await this.setRightPluginVisibleHistory(appKey, visible);
      await this.setCurrentMicroApp({
        appKey,
        visible,
      });
    },

    handleUpdate() {
      this.$emit('update');
    },
  },
};
</script>

<style scoped lang="scss">
.plugin-app-header {
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 16px;
  color: $main-text-color;
  font-weight: bold;
  border-bottom: 1px solid $split-line-color;

  .ls-icon-wrap {
    margin-left: 12px;
    cursor: pointer;

    &:first-child {
      margin-left: 0;
      transform-origin: center;
      transform: rotateZ(180deg);
    }
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
