<template>
  <div class="im-group-settings" v-if="visible">
    <div class="top">
      <div class="left">
        <span
          class="btn"
          :class="selfIsMember && 'active'"
          @click="handleChooseTab(true)"
        >
          群成员
        </span>
        <span
          class="btn"
          :class="!selfIsMember && 'active'"
          @click="handleChooseTab(false)"
        >
          群设置
        </span>
      </div>
      <LsIcon
        class="close-icon"
        width="14"
        height="14"
        render-svg
        icon="a-icon_close2x"
        @click="handleClose"
      ></LsIcon>
    </div>

    <Member
      v-if="selfIsMember"
      v-on="$listeners"
    />
    <Settings v-on="$listeners" v-else />
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import Settings from './settings';
import Member from './member';

export default {
  name: 'Group-panel',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    isMember: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  components: {
    LsIcon,
    Settings,
    Member,
  },
  data() {
    return {
      selfIsMember: true,
    };
  },
  watch: {
    visible() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.selfIsMember = this.isMember;
      this.tabType = this.isMember;
    },
    handleClose() {
      this.$emit('update:visible', false);
    },

    handleChooseTab(isMember) {
      if (isMember === this.selfIsMember) return;
      this.selfIsMember = isMember;
    },
  },
};
</script>

<style scoped lang="scss">
.im-group-settings {
  width: 299px;
  min-width: 299px;
  height: 100%;
  background-color: $bg-white-color;
  padding-top: 22px;
  border-left: 1px solid $split-line-color;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;

  .top {
    width: 100%;
    height: 22px;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    box-sizing: border-box;
    padding: 0 20px;

    .left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      font-size: 16px;
      color: $main-text-color;
      font-weight: bold;

      .btn {
        margin-left: 23px;
        cursor: pointer;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        transition: all 0.3s;

        &::after {
          content: '';
          width: 20px;
          height: 3px;
          background: #fff;
          border-radius: 3px;
          margin-top: 4px;
          transition: all 0.3s;
        }

        &:first-child {
          margin-left: 0;
        }

        &.active {
          color: $primary-color;

          &::after {
            background: $primary-color;
          }
        }
      }
    }

    .close-icon {
      cursor: pointer;
    }
  }
}
</style>
