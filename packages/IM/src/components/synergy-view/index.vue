<template>
  <div class="synergy" :style="getPanelStyle">
    <div class="top">
      <span class="title">协同</span>
      <div class="list" ref="SynergyNav" v-if="!collapse">
        <div
          class="item"
          v-for="session in _sessionList.filter(
            (_d, index) => index <= this.maxNavCount - 1,
          )"
          @click="handleOpenCollapse(session)"
        >
          <el-tooltip
            class="btn"
            effect="dark"
            :content="session.nickname"
            placement="top"
          >
            <el-badge
              :value="session.unreadCount"
              :hidden="!session.unreadCount"
              :max="99"
            >
              <img class="img" :src="session.avatar" alt="" />
            </el-badge>
          </el-tooltip>
        </div>

        <span
          class="opt item"
          v-if="_sessionList.length > maxNavCount"
          :style="{ borderColor: visibleMore ? '#0066ff' : '#ccc' }"
          @click="visibleMore = true"
        >
          <el-badge
            :value="unreadTotalCount"
            :hidden="!unreadTotalCount"
            :max="99"
          >
            <LsIcon
              size="18"
              :color="visibleMore ? '#0066ff' : '#90959F'"
              icon="ls-icon-icon_more"
            ></LsIcon>
          </el-badge>
        </span>

        <span
          class="opt item"
          :style="{ borderColor: visibleAddDialog ? '#0066ff' : '#ccc' }"
          @click="visibleAddDialog = true"
        >
          <LsIcon
            size="14"
            :color="visibleAddDialog ? '#0066ff' : '#90959F'"
            icon="ls-icon-a-icon_"
          ></LsIcon>
        </span>
      </div>
      <span class="right" @click="handleCollapse">
        <LsIcon
          render-svg
          width="12"
          height="20"
          :icon="collapse ? 'ls-icon-icon_zhankai' : 'ls-icon-icon_shouqi'"
        ></LsIcon>
      </span>
    </div>
    <div class="container" ref="SynergyContainer">
      <div class="scroll-view" v-if="!collapse">
        <div
          class="session"
          :class="{
            active: selectSynergy === session.sessId,
            [`session_${formatSessId(session.sessId)}`]: true,
          }"
          v-for="session in _sessionList"
          :style="getStyle(session) || getBasicStyle"
          @click="handleSelectSynergy(session)"
        >
          <ImView
            v-if="session.sessId"
            :key="session.sessId || ''"
            :session="session"
            :isFocus="false"
            :isSmallEditor="true"
            :headerStyle="{
              backgroundColor: '#E7EAF3',
            }"
            :imViewStyle="{
              minWidth: '368px',
            }"
          >
            <template slot="header">
              <div class="btn" v-if="_sessionList.length > 1">
                <LsIcon
                  render-svg
                  width="20"
                  height="20"
                  :icon="
                    getStyle(session).height === MAX_HEIGHT
                      ? 'ls-icon-icon_zuixiaohua2'
                      : 'ls-icon-icon_quanpin1'
                  "
                  @click="handleChangeSize(session)"
                ></LsIcon>
              </div>
              <div class="btn">
                <LsIcon
                  render-svg
                  width="20"
                  height="20"
                  icon="ls-icon-icon_guanbi1"
                  @click="handleClose(session)"
                ></LsIcon>
              </div>
            </template>
          </ImView>
        </div>
      </div>
      <div class="scroll-view-small" v-else>
        <div
          class="item"
          v-for="session in _sessionList"
          @click="handleOpenCollapse(session)"
        >
          <el-tooltip
            class="btn"
            effect="dark"
            :content="session.nickname"
            placement="right"
          >
            <el-badge
              :value="session.unreadCount"
              :hidden="!session.unreadCount"
              :max="99"
            >
              <img class="img" :src="session.avatar" alt="" />
            </el-badge>
          </el-tooltip>
        </div>

        <span class="opt item">
          <LsIcon
            render-svg
            width="14"
            height="14"
            icon="ls-icon-a-icon_"
          ></LsIcon>
        </span>
      </div>
    </div>

    <LsCardDialog :visible.sync="visibleMore">
      <div class="more-list">
        <div class="more-top">
          <span class="label">协同列表</span>
          <span class="right">{{ synergySessionList.length }}</span>
        </div>
        <div class="more-scroll-view">
          <div
            class="item"
            v-for="session in _sessionList"
            @click="handleOpenCollapse(session)"
          >
            <el-badge
              :value="session.unreadCount"
              :hidden="!session.unreadCount"
              :max="99"
            >
              <img class="img" :src="session.avatar" alt="" />
            </el-badge>
            <span class="name">{{ session.nickname }}</span>
          </div>
        </div>
      </div>
    </LsCardDialog>

    <LsCardDialog :visible.sync="visibleAddDialog">
      <div class="synergy-search">
        <div class="title">邀请协同者</div>
        <div class="search" @click="handleSearch">
          <LsIcon
            icon="navi_ss_icon"
            width="14"
            height="14"
            render-svg
          ></LsIcon>
          <div class="input-panel">
            <el-input
              v-model="keywords"
              clearable
              type="text"
              placeholder="搜索组织成员、好友、群聊"
            />
          </div>
          <span class="btn">
            <LsIcon size="14" color="#90959F" icon="ls-icon-a-icon_"></LsIcon>
          </span>
        </div>
        <div class="history" v-if="historySearchList.length">近期协同</div>
        <div class="scroll-view">
          <div class="item" v-for="item in searchList">
            <img class="img" :src="item.avatar" alt="" />
            <span class="name">{{ item.nickname }}</span>
          </div>
        </div>
      </div>
    </LsCardDialog>
  </div>
</template>

<script>
import { lodash } from '@lanshu/utils';
import { mapGetters, mapActions } from 'vuex';
import { LsIcon, LsCardDialog } from '@lanshu/components';
import ImView from '../im-view.vue';
import { IMClearUnreadCount } from '../../IM-SDK';

export default {
  name: 'Synergy',
  components: {
    ImView,
    LsIcon,
    LsCardDialog,
  },
  provide() {
    return {
      isSettings: this.isSettings,
    };
  },
  props: {
    pluginStyle: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters('IMStore', ['sessionList', 'synergySessionList']),

    getBasicStyle() {
      const length = this.synergySessionList.length;
      let height = '40%';
      switch (length) {
        case 1:
          height = this.MAX_HEIGHT;
          break;
        case 2:
          height = '50%';
          break;
        case 3:
          height = '40%';
          break;
      }
      return {
        height,
      };
    },

    _sessionList() {
      return this.sessionList.filter((d) =>
        this.synergySessionList.some((s) => s.sessId === d.sessId),
      );
    },

    getPanelStyle() {
      return this.collapse
        ? {
            width: '72px',
          }
        : {
            width: '100%',
          };
    },

    unreadTotalCount() {
      return this._sessionList
        .map((d) => d.unreadCount)
        .reduce((sum, curr) => sum + curr, 0);
    },
  },
  data() {
    return {
      collapse: false,
      selectSynergy: '',
      MAX_HEIGHT: 'calc(100% - 10px)',
      visibleMore: false,
      visibleAddDialog: false,
      resizeObserver: null,
      maxNavCount: 0,
      keywords: '',
      searchList: [],
      historySearchList: [],
    };
  },

  watch: {
    synergySessionList() {
      this.computedNavCount();
    },
  },

  created() {
    const synergySessionList = lodash
      .cloneDeep(this.sessionList.filter((d, index) => index >= 1))
      .map((d) => {
        const { sessId, avatar, nickname } = d;
        return {
          sessId,
          avatar,
          nickname,
        };
      });
    this.setSynergySessionList(synergySessionList);
  },

  mounted() {
    this.$emit('update:pluginStyle', {
      flex: '1 1 0',
      minWidth: '400px',
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        this.computedNavCount(cr.width);
      }
    });
    this.resizeObserver = resizeObserver;
    // 观察一个或多个元素
    this.resizeObserver.observe(this.$refs.SynergyNav);
  },

  methods: {
    ...mapActions('IMStore', [
      'setSynergySessionList',
      'removeSynergySessionList',
    ]),

    getStyle(session) {
      const target = this.synergySessionList.find(
        (d) => d.sessId === session.sessId,
      );
      if (target?.style) return target.style;
      return this.getBasicStyle;
    },

    handleChangeSize(session) {
      const synergySessionList = this.synergySessionList.map((d) => {
        if (d.sessId === session.sessId) {
          d.style =
            d?.style?.height === this.MAX_HEIGHT
              ? this.getBasicStyle
              : {
                  height: this.MAX_HEIGHT,
                };
        }

        return { ...d };
      });
      this.setSynergySessionList(synergySessionList);
    },
    handleClose(session) {
      this.removeSynergySessionList(session);
    },

    handleCollapse() {
      this.collapse = !this.collapse;
      const pluginStyle = this.collapse
        ? { flex: 'unset', minWidth: '72px' }
        : { flex: '1 1 0', minWidth: '400px' };
      this.$emit('update:pluginStyle', pluginStyle);
    },

    handleOpenCollapse(session) {
      this.handleActiveSynergy(session);
      this.visibleMore = false;
      this.collapse = false;
      this.$nextTick(() => {
        this.computedNavCount();
        const target = this.getSessionTarget(session);
        this.$refs.SynergyContainer.scrollTo({
          top: target.offsetTop - 10,
          behavior: 'smooth',
        });
      });
    },

    handleActiveSynergy(session) {
      const { sessId, unreadCount } = session;
      this.selectSynergy = sessId;
      if (unreadCount) {
        IMClearUnreadCount(sessId);
      }
    },

    handleSelectSynergy(session) {
      this.handleActiveSynergy(session);
      this.getSessionTarget(session);
    },

    formatSessId(sessId) {
      return sessId.replace(':', '');
    },

    getSessionTarget(session) {
      const { sessId } = session;
      const target = document.querySelector(
        `.session_${this.formatSessId(sessId)}`,
      );
      target.querySelector('.editor-container')?.focus();
      return target;
    },

    computedNavCount(containerWidth) {
      if (!containerWidth) {
        const { width = '' } =
          this.$refs.SynergyNav?.getBoundingClientRect() || {};
        if (!width) return;
        containerWidth = width;
      }
      const viewWidth = containerWidth - (36 + 16);
      const count = Math.floor(viewWidth / (36 + 16));
      this.maxNavCount = count;
    },

    handleSearch() {},
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.observe(this.$refs.SynergyNav);
    }
  },
};
</script>

<style scoped lang="scss">
.synergy {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-white-color;
  position: relative;

  .top {
    width: 100%;
    height: 56px;
    border-bottom: 1px solid $split-line-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 22px 0 18px;
    position: relative;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: $main-text-color;
    }

    .list {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      overflow: hidden;
      padding-left: 16px;

      .item {
        width: 36px;
        height: 36px;
        background-color: #f2f4f8;
        margin-right: 16px;
        border-radius: 5px;

        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        .img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }

        &:last-child {
          margin-right: 0;
        }

        &.opt {
          border: 1px solid #ccc;
          ::v-deep .el-badge {
            display: flex;
            .el-badge__content {
              right: 4px;
              top: -9px;
            }
          }
        }

        ::v-deep .el-badge__content {
          right: 14px;
        }
      }
    }

    .right {
      width: 16px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e7eaf3;
      cursor: pointer;
    }
  }

  .container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 10px 0 10px;
    position: relative;

    .scroll-view {
      height: 100%;
      box-sizing: border-box;

      .session {
        width: 100%;
        min-height: 40%;
        margin-bottom: 10px;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #e7eaf3;
        box-sizing: border-box;

        &:last-child {
          margin-bottom: 0;
        }

        &.active {
          border-color: #2b83fa;
        }
      }

      &:after {
        content: '';
        width: 100%;
        height: 10px;
        display: block;
      }
    }

    .scroll-view-small {
      height: 100%;
      box-sizing: border-box;

      .item {
        width: 36px;
        height: 36px;
        margin: 0 auto 10px;
        cursor: pointer;

        background-color: #f2f4f8;
        border-radius: 5px;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        .img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }

        &:last-child {
          margin-bottom: 0;
        }

        &.opt {
          border: 1px solid #ccc;
        }

        ::v-deep .el-badge__content {
          top: 2px;
        }
      }

      &:after {
        content: '';
        width: 100%;
        height: 10px;
        display: block;
      }
    }
  }
}
</style>

<style scoped lang="scss">
.more-list {
  width: 360px;
  height: 460px;
  position: absolute;
  top: 112px;
  right: 16px;
  background-color: $bg-white-color;
  box-shadow: 0px 2px 8px 0px rgba(143, 149, 158, 0.1);
  border-radius: 4px;
  border: 1px solid $split-line-color;
  display: flex;
  flex-direction: column;
  padding-bottom: 6px;

  .more-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 18px 13px 14px;

    .label {
      font-size: 14px;
      color: $main-text-color;
    }

    .right {
      font-size: 12px;
      color: #8f959e;
    }
  }
  .more-scroll-view {
    flex: 1;
    padding: 0 6px;
    overflow-y: auto;

    .item {
      height: 56px;
      background-color: $bg-white-color;
      border-radius: 6px;
      padding: 8px 12px 8px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .img {
        display: block;
        width: 36px;
        height: 36px;
        border-radius: 4px;
      }

      .name {
        flex: 1;
        padding-left: 8px;
        font-size: 14px;
        color: $main-text-color;
      }

      &:hover {
        background-color: $bg-hover-grey-color;
      }
    }
  }
}

.synergy-search {
  width: 360px;
  max-height: 460px;
  min-height: 120px;
  position: absolute;
  top: 112px;
  right: 16px;
  background-color: $bg-white-color;
  box-shadow: 0px 2px 8px 0px rgba(143, 149, 158, 0.1);
  border-radius: 4px;
  border: 1px solid $split-line-color;
  display: flex;
  flex-direction: column;
  padding-bottom: 6px;

  .title {
    font-size: 14px;
    font-weight: bold;
    color: $main-text-color;
    padding: 12px 14px 14px;
  }

  .search {
    width: 332px;
    height: 36px;
    min-height: 36px;
    background-color: $bg-white-color;
    border-radius: 6px;
    border: 1px solid $split-line-color;
    padding-left: 18px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;

    .input-panel {
      flex: 1;
      height: 36px;
      padding-left: 8px;
      font-size: 14px;
      cursor: pointer;

      ::v-deep .el-input {
        border: none;
        height: 36px;

        .el-input__inner {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          padding: 0 32px 0 0;
        }

        input::placeholder {
          color: $tips-text-color;
          font-size: 14px;
        }
      }
    }

    .btn {
      width: 46px;
      height: 100%;
      background: #f2f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .history {
    font-size: 14px;
    color: $minor-text-color;
    margin: 22px 0 12px 0;
    padding: 0 14px;
  }

  .scroll-view {
    flex: 1;
    padding: 0 6px;
    overflow-y: auto;

    .item {
      height: 56px;
      background-color: $bg-white-color;
      border-radius: 6px;
      padding: 8px 12px 8px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .img {
        display: block;
        width: 36px;
        height: 36px;
        border-radius: 4px;
      }

      .name {
        flex: 1;
        padding-left: 8px;
        font-size: 14px;
        color: $main-text-color;
      }

      &:hover {
        background-color: $bg-hover-grey-color;
      }
    }
  }
}
</style>
