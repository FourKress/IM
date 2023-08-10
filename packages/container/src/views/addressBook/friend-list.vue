<template>
  <div class="friend-list">
    <div class="py-nav">
      <span
        v-for="item in pyList"
        :key="item"
        :class="navSelectKey === item && 'active'"
        @click="filterAddress(item)"
      >
        {{ item }}
      </span>
    </div>
    <div class="list">
      <div
        class="scroll-view selected-scroll-view"
        v-if="addressBookList.length"
      >
        <div
          class="group-panel"
          :id="`${key}-group`"
          :key="key"
          v-for="(group, key) in addressBookPYObj"
        >
          <span class="group-name">
            {{ key === isSpecial ? specialKey : key }}
          </span>

          <div
            class="item"
            v-for="item in group"
            v-if="item.nickname"
            :key="item.userId"
            @click="(event) => handleFriend(item, event)"
          >
            <div class="info">
              <div class="img">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="name">
                <span>{{ item.remark ? item.remark : item.nickname }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LsEmptyData
        v-else
        :imgSrc="LsAssets.notFriend"
        :tips="`暂无${isBot ? '技术支持' : '好友'}`"
      ></LsEmptyData>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="{ isPass: true }"
        :isBot="isBot"
        @sendMsg="handleSendMsg"
        @sendVideo="handleSendVideo"
        @sendAudio="handleSendAudio"
        @update="handleUpdate"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { AddressBookMixins, FriendMixins } from '@lanshu/utils';
import {
  LsCardDialog,
  LsFriendPanel,
  LsAssets,
  LsEmptyData,
} from '@lanshu/components';
import { mapGetters } from 'vuex';

export default {
  name: 'Friend-List',
  props: {
    isBot: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [FriendMixins, AddressBookMixins],
  components: {
    LsCardDialog,
    LsFriendPanel,
    LsEmptyData,
  },
  computed: {
    ...mapGetters('IMStore', ['refreshAddressBook']),
  },
  watch: {
    // 刷新列表通知
    refreshAddressBook(val) {
      if (val) {
        this.handleUpdate();
      }
    },
  },
  data() {
    return {
      LsAssets,
    };
  },
  created() {
    // 设置最大最小滚动距离
    this.minScrollTop = 80;
    this.maxScrollTop = 120;
  },
  mounted() {
    this.handleRegisterScroll();
    this.getFriendListData();
  },
  methods: {
    handleUpdate() {
      this.handleCloseDialog();
      this.getFriendListData();
    },
    async handleFriend(item, event) {
      // 打开好友面板
      await this.openFriendDialog(event, async () => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

<style scoped lang="scss">
.friend-list {
  overflow: hidden;
  height: 100%;

  .py-nav {
    width: 10px;
    right: 27px;
    top: 50%;
    z-index: 8;
    transform: translateY(-50%);
    font-size: 12px;
    position: absolute;
    color: $minor-text-color;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      cursor: pointer;
      line-height: 28px;
      position: relative;

      &.active {
        color: $bg-white-color;
        font-weight: bold;

        &:before {
          content: '';
          display: block;
          width: 30px;
          height: 30px;
          background: $primary-color;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: -1;
        }
      }
    }
  }

  .list {
    overflow: hidden;
    height: 100%;
    box-sizing: border-box;

    .scroll-view {
      overflow-y: auto;
      overflow-x: hidden;
      transform: translate3d(0, 0, 0);
      height: 100%;

      .group-panel {
        display: flex;
        flex-direction: column;

        .group-name {
          font-size: 12px;
          color: $main-text-color;
          height: 28px;
          line-height: 28px;
          background: $bg-IM-color;
          padding-left: 15px;
          margin-bottom: 20px;
        }
      }

      .item {
        height: 46px;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        cursor: pointer;
        padding: 0 24px;
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 20px;
        }

        .info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 9px;
          border-radius: 6px;

          &:hover {
            background-color: $bg-hover-grey-color;
          }

          .img {
            width: 46px;
            height: 46px;
            margin-right: 8px;
            border-radius: 6px;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }

          .name {
            flex: 1;
            font-size: 14px;
            color: $main-text-color;
          }
        }
      }
    }
  }
}
</style>
