<template>
  <div id="client-sidebar" v-if="sessionList.length">
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
        <div class="top-panel-wrap">
          <div
            class="top-item"
            v-for="(item, index) in topSessionList"
            :key="formatSessId(item.sessId)"
            @click="handleMenuClick(item)"
            v-contextMenu:[topSessionList[index]]="topContextMenuList"
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

      <div
        class="data-sync-status"
        :style="{
          height:
            IM_DataSync_Status && IM_DataSync_Status.value !== 2 ? '42px' : '0',
        }"
      >
        <img class="loading-icon" :src="LsAssets.loadingIcon" alt="" />
        <span v-if="IM_DataSync_Status">{{ IM_DataSync_Status.label }}</span>
      </div>

      <div class="sidebar-menu" ref="sidebarMenu">
        <div
          class="menu-item"
          v-for="(item, index) in selfSessionList"
          :key="formatSessId(item.sessId)"
          :class="currentSession === item.sessId && 'active'"
          @click="handleMenuClick(item)"
          v-contextMenu:[selfSessionList[index]]="contextMenuList"
        >
          <div class="img">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="info">
            <div class="row">
              <div
                class="title-row"
                :class="
                  item.toUserType === SESSION_USER_TYPE.IS_BOT && 'is-bot'
                "
              >
                <div class="name">
                  {{ item.nickname }}
                </div>
                <div
                  v-if="item.toUserType === SESSION_USER_TYPE.IS_BOT"
                  class="bot-tag"
                >
                  机器人
                </div>
              </div>

              <span class="time">
                <TimesTransform
                  v-if="item.lastMsg"
                  :timestamp="item.lastMsg.timestamp"
                  :key="updateTimer"
                />
              </span>
            </div>
            <div class="msg-row">
              <span class="message">
                <MsgTextType
                  v-if="item.lastMsg"
                  :lastMsg="item.lastMsg"
                  :isAtMe="item.isAtMe === 1"
                  :tempMsg="
                    currentSession === item.sessId
                      ? {}
                      : historyTempMsgOBJ[item.sessId]
                  "
                />
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
import {
  MsgTextType,
  TimesTransform,
  LsIcon,
  LsAssets,
} from '@lanshu/components';
import { IMClearUnreadCount, IMDelBySessId, IMSetTopStatus } from '@lanshu/im';
import { formatSessId, SESSION_USER_TYPE } from '@lanshu/utils';

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
      historyTempMsgOBJ: {},
      contextMenuList: [
        {
          label: (session) => {
            return session?.topState ? '取消置顶' : '置顶';
          },
          handler: this.setMsgTopStatus,
          icon: (session) => {
            return session?.topState
              ? 'ls-icon-quxiaozhiding'
              : 'ls-icon-zhiding';
          },
        },
        {
          label: () => '不显示',
          handler: this.handleHideSession,
          icon: () => 'ls-icon-mimayincang',
        },
      ],
      topContextMenuList: [
        {
          label: () => '取消置顶',
          handler: this.setMsgTopStatus,
          icon: () => 'ls-icon-quxiaozhiding',
        },
      ],
      _sessionList: [],
      updateTimer: Date.now(),
      tempMsgTimer: 0,
    };
  },
  components: {
    MsgTextType,
    TimesTransform,
    LsIcon,
  },
  computed: {
    SESSION_USER_TYPE() {
      return SESSION_USER_TYPE;
    },
    ...mapGetters('IMStore', [
      'sessionList',
      'mainSessionWindow',
      'allUnreadCount',
      'IM_DataSync_Status',
      'synergyStatus',
    ]),
    topSessionList() {
      return this.selfSessionList.filter((d) => d.topState === 1);
    },
  },
  watch: {
    sessionList: {
      deep: true,
      handler() {
        this.initData();
      },
    },
    mainSessionWindow: {
      deep: true,
      handler(val) {
        if (this.isScroll) {
          this.$refs.sidebarMenu.scrollTop = 0;
        }
        this.isScroll = true;
        this.currentSession = val?.sessId;
      },
    },
    synergyStatus() {
      this.initSessionList();
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),
    formatSessId,

    initSessionList() {
      this._sessionList = this.synergyStatus
        ? this.sessionList.filter((d) => !d.isHelp)
        : this.sessionList;
      this.updateTimer = Date.now();
      this.selfSessionList = this._sessionList;
    },
    initData() {
      this.initSessionList();
      this._setMainSessionWindow();
    },
    handleChooseTab(isAll) {
      this.tabType = isAll;
      if (isAll === this.isAll) {
        this.selfSessionList = this._sessionList;
      } else {
        this.selfSessionList = this._sessionList.filter((d) => d?.unreadCount);
      }
    },
    handleSetSessionWindow(sessId, mainSessionWindow) {
      this.isScroll = false;
      this.setMainSessionWindow(mainSessionWindow);
      if (mainSessionWindow?.unreadCount > 0) {
        IMClearUnreadCount(sessId);
      }
    },
    _setMainSessionWindow() {
      const sessionList = this.selfSessionList;
      if (!sessionList?.length) return;
      const currentSession = this.mainSessionWindow?.sessId;
      if (currentSession) {
        this.currentSession = currentSession;
        const targetSession = sessionList.find(
          (d) => d.sessId === currentSession,
        );
        // TODO 临时处理手动创建会话时 mainSessionWindow 的更新问题
        if (!targetSession || this.mainSessionWindow?.nickname) return;
        this.handleSetSessionWindow(currentSession, targetSession);
      }
    },
    async handleMenuClick(session) {
      const sessId = session.sessId;
      this.handleSetSessionWindow(sessId, session);
      // 延迟300ms后查询草稿，保证草稿已存储
      this.tempMsgTimer && clearTimeout(this.tempMsgTimer);
      this.tempMsgTimer = setTimeout(async () => {
        await this.getHistoryTempMsg();
      }, 300);
    },
    async getHistoryTempMsg() {
      // 获取切换时保存的临时类容
      this.historyTempMsgOBJ = await window.$lanshuStore.getItem('tempMsgOBJ');
    },

    handleHideSession(session) {
      IMDelBySessId(session.sessId);
      if (session.sessId === this.mainSessionWindow.sessId) {
        this.setMainSessionWindow({});
      }
    },

    setMsgTopStatus(session) {
      const { topState } = session;
      IMSetTopStatus(session.sessId, topState === 1 ? 0 : 1);
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

      .top-panel-wrap {
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
          width: 32px;
          height: 32px;
          border-radius: 6px;
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
      width: 100%;
      background: $split-line-color;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: normal;
      color: $minor-text-color;
      transition: all 0.2s;
      overflow: hidden;
      margin: -13px 0 12px 0;

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
        padding: 12px 10px 12px 14px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s;
        transform: translate3d(0, 0, 0);
        margin-bottom: 4px;

        &.active {
          background-color: #e9f2ff;
          &:hover {
            background-color: #e9f2ff;
          }
        }

        &:hover {
          background-color: $bg-hover-grey-color;
        }

        .img {
          width: 40px;
          height: 40px;
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

            .title-row {
              display: flex;
              align-items: center;
              width: 110px;
              max-width: 110px;

              .name {
                flex: 1;
                height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                color: $main-text-color;
              }

              .bot-tag {
                width: 38px;
                padding: 2px 0;
                margin-left: 4px;
                text-align: center;
                background: linear-gradient(110deg, #d2fff2 -11%, #b8c4ff 98%);
                border-radius: 4px;
                overflow: hidden;
                font-size: 10px;
                color: $primary-color;
              }

              &.is-bot {
                .name {
                  flex: unset;
                  max-width: 66px;
                }
              }
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
              width: 140px;
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
