<template>
  <div class="org-list">
    <div class="bread-crumb">
      <span v-for="(item, index) in orgBreadCrumbs">
        <span class="item" :class="index === orgBreadCrumbs.length - 1 && 'last'">
          {{ item.label }}
        </span>
        <span class="split" v-if="index !== orgBreadCrumbs.length - 1">/</span>
      </span>
    </div>

    <div class="list">
      <div class="scroll-view" v-if="orgList.length">
        <div class="item" v-for="item in orgList" :key="item.id" @click="handleOrg">
          <span class="org-icon">
            <LsIcon
              icon="ls-icon-a-icon_mrtb2x"
              width="34"
              height="34"
              render-svg
            ></LsIcon>
          </span>
          <span class="label">{{item.label}}</span>
          <span class="more">
             <LsIcon
               icon="ls-icon-icon_right"
               width="14"
               height="14"
               render-svg
             ></LsIcon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {LsIcon} from '@lanshu/components'

export default {
  name: 'Org-list',
  components: {
    LsIcon,
  },
  computed: {
    ...mapGetters('routerStore', ['orgBreadCrumbs']),
  },
  data() {
    return {
      orgList: [{
        label: '子部门',
        id: 11
      }, {
        label: '搜索',
        id: 33
      }]
    }
  },
  methods: {
    handleOrg() {

    }
  }
};
</script>

<style scoped lang="scss">
.org-list {
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  .bread-crumb {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 14px 0 16px 0;

    font-size: 12px;
    color: $primary-hover-color;

    .item {
      cursor: pointer;
      &.last {
        color: $tips-text-color;
        cursor: default;
      }
    }

    .split {
      color: $tips-text-color;
      padding: 0 4px;
    }
  }

  .list {
    overflow-y: auto;
    overflow-x: hidden;
    transform: translate3d(0, 0, 0);
    scroll-behavior: smooth;
    height: 100%;

    .scroll-view {

      .item {
        width: 100%;
        height: 66px;
        padding: 16px 30px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        border-radius: 6px;

        &:hover {
          background: $bg-hover-grey-color;
        }

        .org-icon {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          margin-right: 10px;
        }

        .label {
          flex: 1;
          font-size: 14px;
        }

        .more {
          width: 14px;
          height: 14px;
        }

      }
    }
  }
}

</style>
