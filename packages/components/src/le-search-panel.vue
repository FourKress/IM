<template>
  <div class="ls-search-panel" v-if="visible" @click.self="handleClose">
    <div class="container">
      <div class="search-warp">
        <div class="search">
          <div class="query-icon">
            <LsIcon icon="navi_ss_icon" render-svg></LsIcon>
          </div>
          <div class="input-panel">
            <el-input
              ref="searchInput"
              v-model="keywords"
              @input="handleSearch"
              clearable
              type="text"
              placeholder="搜索"
            />
          </div>
          <div class="add">
            <LsIcon icon="navi_ss_add" render-svg></LsIcon>
          </div>
        </div>
      </div>
      <div class="tabs">
        <span
          class="btn"
          :class="tabType === TAB_TYPE.IS_ALL && 'active'"
          @click="handleChooseTab(TAB_TYPE.IS_ALL)"
        >
          综合
        </span>
        <span
          class="btn"
          :class="tabType === TAB_TYPE.IS_Address && 'active'"
          @click="handleChooseTab(TAB_TYPE.IS_Address)"
        >
          联系人
        </span>
        <span
          class="btn"
          :class="tabType === TAB_TYPE.IS_GROUP && 'active'"
          @click="handleChooseTab(TAB_TYPE.IS_GROUP)"
        >
          群组
        </span>
      </div>
      <div class="search-history" v-if="searchHistory.length">
        <div class="row">
          <span class="left">搜索历史</span>
          <span class="right" @click="handleClearHistory">
            <LsIcon icon="ls-icon-icon_shanchu" color="#999"></LsIcon>
          </span>
        </div>
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in searchHistory"
            :key="index"
            @click="setSearchKeywords(item)"
          >
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="search-list" v-if="searchData.length">
        <div class="scroll-view">
          <div class="item" v-for="item in searchData" :key="item.userId" @click="(event) => handleFriend(item, event)">
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

      <div class="empty-data" v-if="isEmpty">
        没有找到“
        <span class="link">{{ keywords }}</span>
        ”相关的结果
      </div>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { lodash } from '@lanshu/utils';
import { mapActions, mapGetters } from 'vuex';
import { IMGetAllFriendList, IMGetByUserId, IMGetGroupList } from '@lanshu/im';

const TAB_TYPE = {
  IS_ALL: 'All',
  IS_GROUP: 'Group',
  IS_Address: 'Address',
};

export default {
  name: 'Ls-search-panel',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  components: {
    LsIcon,
  },
  computed: {
    ...mapGetters('globalStore', ['searchHistory']),
    ...mapGetters('IMStore', ['sessionList']),
  },
  data() {
    return {
      TAB_TYPE,
      keywords: '',
      tabType: TAB_TYPE.IS_ALL,
      groupData: [],
      addressBooKData: [],
      searchData: [],
      isEmpty: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.setClassName('no-drag');
        this.getData();
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      } else {
        this.setClassName('drag');
      }
    },
    tabType() {
      this.getSearchResult(this.keywords);
    },
  },
  methods: {
    ...mapActions('globalStore', ['setSearchHistory']),
    ...mapActions('IMStore', ['setMainSessionWindow']),

    handleChooseTab(type) {
      this.tabType = type;
    },
    handleClose() {
      this.$emit('update:visible', false);
    },

    handleSearch: lodash.debounce(function (val) {
      if (!val) {
        this.isEmpty = false;
        this.searchData = [];
        return;
      }
      this.getSearchResult(val);
    }, 400),

    getSearchResult(keywords) {
      const dataMap = {
        [TAB_TYPE.IS_ALL]: [...this.groupData, ...this.addressBooKData],
        [TAB_TYPE.IS_GROUP]: this.groupData,
        [TAB_TYPE.IS_Address]: this.addressBooKData,
      };
      const originData = dataMap[this.tabType];
      const searchData = originData.filter((d) => {
        const { nickname, remark = '' } = d;
        if (nickname && nickname.includes(keywords)) return true;
        if (remark && remark.includes(keywords)) return true;
        return false;
      });
      console.log(originData, searchData);

      this.searchData = searchData;

      this.isEmpty = !this.searchData.length && keywords;
    },

    handleClearHistory() {
      this.setSearchHistory([]);
    },

    setSearchKeywords(val) {
      this.keywords = val;
      this.handleSearch(val);
    },

    async getData() {
      this.keywords = '';
      this.searchData = '';
      this.isEmpty = false;
      this.tabType = TAB_TYPE.IS_ALL;
      const groupRes = await IMGetGroupList();
      const addressBooKRes = await IMGetAllFriendList();
      this.groupData = groupRes?.data || [];
      this.addressBooKData = addressBooKRes?.data || [];
    },

    async handleFriend(item) {
      const hasHistory = this.searchHistory.some((d) => d === this.keywords);
      if (hasHistory) {
        const temp = this.searchHistory.filter((d) => d !== this.keywords);
        await this.setSearchHistory([this.keywords, ...temp]);
      } else {
        await this.setSearchHistory([this.keywords, ...this.searchHistory]);
      }

      await this.handleJumIMPage(item);
    },

    async handleJumIMPage(friend) {
      const { userId, groupId = '' } = friend;
      await this.startSession(groupId || userId);
      this.$nextTick(() => {
        const currentPath = this.$route.path;
        if (currentPath !== '/') {
          this.$router.push('/');
        }
        this.handleClose();
      });
    },
    async startSession(userId) {
      let session;
      const storeSession = this.sessionList.find((d) => d.toUser === userId);
      if (storeSession) {
        session = storeSession;
      } else {
        const res = await IMGetByUserId(userId);
        if (!res?.data) return;
        session = res.data;
      }
      await this.setMainSessionWindow(session);
    },

    setClassName(className) {
      const hearerSearch = document.querySelector('#client-header');
      if (hearerSearch) {
        // 控制头部拖拽效果
        hearerSearch.className = `${className}`;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.ls-search-panel {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  .container {
    width: 980px;
    height: 680px;
    background: $bg-white-color;
    border-radius: 20px;
    margin: 8px auto 0;
    padding: 0 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .search-warp {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 22px;

      .search {
        width: 100%;
        height: 48px;
        background-color: $bg-white-color;
        box-shadow: 0px 0px 6px 0px #9dc4ff;
        border: 1px solid $primary-color;
        border-radius: 10px;
        padding: 0 18px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .query-icon {
          width: 18px;
          height: 18px;
        }

        .input-panel {
          flex: 1;
          height: 40px;
          padding: 0 8px;
          border-right: 1px solid $split-line-color;
          font-size: 14px;

          ::v-deep .el-input {
            border: none;
            height: 40px;

            .el-input__inner {
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              padding: 0 30px 0 0;
            }

            input::placeholder {
              color: $tips-text-color;
              font-size: 14px;
            }
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

    .tabs {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 20px 0 26px;

      font-size: 16px;
      font-weight: bold;
      color: $minor-text-color;

      .btn {
        margin-left: 23px;
        cursor: pointer;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        line-height: 22px;

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

    .search-history {
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $tips-text-color;
        font-size: 14px;
        margin-bottom: 20px;

        .right {
          cursor: pointer;
        }
      }

      .list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .item {
          min-width: 44px;
          text-align: center;
          height: 32px;
          line-height: 32px;
          background: #eaebee;
          border-radius: 16px;
          font-size: 14px;
          padding: 0 15px;
          margin: 0 12px 12px 0;
          cursor: pointer;
        }
      }
    }

    .search-list {
      margin-top: 10px;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;

      transform: translate3d(0, 0, 0);

      .scroll-view {
        .item {
          height: 66px;
          background-color: $bg-white-color;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          cursor: pointer;
          padding: 10px;
          border-radius: 6px;

          &:hover {
            background-color: $bg-hover-grey-color;
          }

          .info {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;

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

    .empty-data {
      height: 20px;
      font-size: 14px;
      margin: 170px auto 0;
      text-align: center;

      .link {
        color: $primary-color;
      }
    }
  }
}
</style>
