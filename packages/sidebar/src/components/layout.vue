<template>
  <div id="client-sidebar">
    <div class="sidebar-container">
      <div class="top">
        <div class="left">
          <span
            class="btn"
            :class="tabType === isAll && 'active'"
            @click="handleChooseTab(isAll)"
          >
            <el-badge is-dot :hidden="!allUnreadCount">全部</el-badge>
          </span>
          <span
            class="btn"
            :class="tabType === !isAll && 'active'"
            @click="handleChooseTab(!isAll)"
          >
            <el-badge is-dot :hidden="!allUnreadCount">未读</el-badge>
          </span>
        </div>
      </div>

      <div class="top-panel" v-if="topSessionList.length && tabType === isAll">
        <div class="top-panel-warp">
          <div
            class="top-item"
            v-for="item in topSessionList"
            :key="item.nickname"
            @click="handleMenuClick(item)"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.nickname"
              placement="top"
            >
              <img class="img" :src="item.avatar" alt="" />
            </el-tooltip>
          </div>
        </div>
      </div>

      <div class="data-sync-status" :style="{height: IM_DataSync_Status && IM_DataSync_Status.value !== 2 ? '42px' : '0'}">
        <img class="loading-icon" :src="LsAssets.loadingIcon" alt="">
        <span>{{ IM_DataSync_Status.label }}</span>
      </div>

      <div class="sidebar-menu" ref="sidebarMenu">
        <div
          class="menu-item"
          v-for="item in selfSessionList"
          :key="item.nickname"
          :class="currentSession === item.sessId && 'active'"
          @click="handleMenuClick(item)"
        >
          <div class="img">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="info">
            <div class="row">
              <span class="name">{{ item.nickname }}</span>
              <span class="time">
                <TimesTransform
                  v-if="item.lastMsg"
                  :timestamp="item.lastMsg.timestamp"
                />
              </span>
            </div>
            <div class="msg-row">
              <span class="message">
                <MsgTextType v-if="item.lastMsg" :lastMsg="item.lastMsg" />
              </span>

              <span class="unread-count" v-if="item.unreadCount">
                <el-badge
                  :value="item.unreadCount"
                  :max="99"
                  class="item"
                ></el-badge>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { MsgTextType, TimesTransform, LsIcon, LsAssets } from '@lanshu/components';
import { IMClearUnreadCount } from '@lanshu/im';

const isAll = true;

export default {
  name: 'MainSidebar',
  data() {
    return {
      isAll,
      tabType: isAll,
      currentSession: '',
      selfSessionList: [],
      LsAssets,
      isScroll: true,
    };
  },
  components: {
    MsgTextType,
    TimesTransform,
    LsIcon
  },
  computed: {
    ...mapGetters('IMStore', [
      'sessionList',
      'mainSessionWindow',
      'sessionWindowList',
      'allUnreadCount',
      'IM_DataSync_Status',
    ]),
    topSessionList() {
      return this.selfSessionList.filter((d) => d.topState === 1);
    },
  },
  watch: {
    sessionList: {
      deep: true,
      handler(val) {
        this.selfSessionList = val;
        // this._setMainSessionWindow(val);
      },
    },
    mainSessionWindow: {
      deep: true,
      handler(val) {
        console.log(val, 'mainSessionWindow')
        if (this.isScroll) {
          this.$refs.sidebarMenu.scrollTop = 0;
        }
        this.isScroll = true;
        this.currentSession = val?.sessId;
      }
    }
  },
  mounted() {
    this.selfSessionList = this.sessionList;
    // this._setMainSessionWindow(this.sessionList);
  },
  methods: {
    ...mapActions('IMStore', [
      'setMainSessionWindow',
      'addSessionWindowList',
      'setAllSession',
    ]),
    handleChooseTab(isAll) {
      this.tabType = isAll;
      if (isAll === this.isAll) {
        this.selfSessionList = this.sessionList;
      } else {
        this.selfSessionList = this.sessionList.filter((d) => d?.unreadCount);
      }
    },
    handleSetSessionWindow(sessId, mainSessionWindow) {
      const sessionWindowList = [
        this.mainSessionWindow,
        ...this.sessionWindowList,
      ];
      if (sessionWindowList.some((d) => d.sessId === sessId)) return;
      this.isScroll = false;
      this.setMainSessionWindow(mainSessionWindow);
      IMClearUnreadCount(sessId);
    },
    _setMainSessionWindow(sessionList) {
      if (!sessionList?.length) return;
      if (this.mainSessionWindow?.sessId) {
        this.currentSession = this.mainSessionWindow.sessId;
      } else {
        const mainSessionWindow = sessionList[0];
        const { sessId } = mainSessionWindow;
        this.handleSetSessionWindow(sessId, mainSessionWindow);
      }
    },
    handleMenuClick(session) {
      const sessId = session.sessId;
      this.handleSetSessionWindow(sessId, session);
      // this.addSessionWindowList(session)
    },
  },
};
</script>

<style scoped lang="scss">
#client-sidebar {
  width: 265px;
  min-width: 265px;
  height: 100%;
  background-color: $bg-white-color;
  padding-bottom: 10px;
  box-sizing: border-box;

  ::-webkit-scrollbar {
    display: none;
  }

  .sidebar-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 10px 18px 20px;

      .left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;

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
    }

    .top-panel {
      padding: 0 10px 12px 10px;

      .top-panel-warp {
        padding: 0 10px 12px 10px;
        box-sizing: border-box;
        display: grid;
        justify-content: space-between;
        justify-items: center;
        align-content: flex-start;
        align-items: center;
        grid-row-gap: 12px;
        grid-template-columns: repeat(5, 34px);
        border-bottom: 1px solid $split-line-color;

        .top-item {
          width: 34px;
          height: 34px;
          border-radius: 5px;
          overflow: hidden;
          cursor: pointer;

          .img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .data-sync-status {
      width: 264px;
      background: $split-line-color;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: normal;
      color: $minor-text-color;
      transition: all .2s;
      overflow: hidden;

      .loading-icon {
        display: block;
        width: 17px;
        height: 17px;
        transform-origin: center;
        margin-right: 6px;
        animation: 2s loadLoop linear infinite normal;
      }

      @keyframes loadLoop {
        0% {
          transform: rotateZ(0deg);
        }
        100% {
          transform: rotateZ(360deg);
        }
      }
    }

    .sidebar-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 10px;
      overflow-y: auto;
      transform: translate3d(0, 0, 0);

      .menu-item {
        width: 245px;
        height: 72px;
        border-radius: 6px;
        padding: 13px 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s;
        transform: translate3d(0, 0, 0);

        &.active {
          background: #e9f2ff;
        }

        .img {
          width: 46px;
          height: 46px;
          border-radius: 6px;
          overflow: hidden;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          margin-left: 8px;

          .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            width: 100%;

            .name {
              height: 20px;
              width: 80px;
              max-width: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
              font-weight: bold;
              color: $main-text-color;
            }

            .time {
              font-size: 12px;
              font-weight: normal;
              color: $tips-text-color;
            }
          }

          .msg-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;

            .message {
              width: 145px;
              font-size: 12px;
              color: $tips-text-color;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .unread-count {
              transform: translateY(-1px);
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }
    }
  }
}
</style>
