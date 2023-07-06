<template>
  <div class="history-msg" v-if="visibleDrawer">
    <Drawer title="聊天记录" @close="handleCloseDrawer">
      <div class="drawer-content">
        <div class="tabs">
          <span
            class="btn"
            :class="tabType === TAB_TYPE.IS_KEYWORDS && 'active'"
            @click="handleChooseTab(TAB_TYPE.IS_KEYWORDS)"
          >
            关键字
          </span>
          <span
            class="btn"
            :class="tabType === TAB_TYPE.IS_FILE && 'active'"
            @click="handleChooseTab(TAB_TYPE.IS_FILE)"
          >
            文件
          </span>
          <span
            class="btn"
            :class="tabType === TAB_TYPE.IS_IMAGE && 'active'"
            @click="handleChooseTab(TAB_TYPE.IS_IMAGE)"
          >
            图片
          </span>
          <span
            class="btn"
            :class="tabType === TAB_TYPE.IS_VIDEO && 'active'"
            @click="handleChooseTab(TAB_TYPE.IS_VIDEO)"
          >
            视频
          </span>
          <span
            class="btn"
            :class="tabType === TAB_TYPE.IS_AUDIO && 'active'"
            @click="handleChooseTab(TAB_TYPE.IS_AUDIO)"
          >
            音频
          </span>
        </div>

        <div class="search-row" v-if="tabType === TAB_TYPE.IS_KEYWORDS">
          <el-input
            placeholder="搜索关键字"
            v-model="keywords"
            @change="handleSearchKeywords"
            @submit.native.prevent
            @keyup.enter.native="handleSearchKeywords"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>

        <div
          class="history-msg-list"
          ref="historyMsgList"
          @scroll="handleScroll"
        >
          <div class="scroll-view" v-if="historyMsgList.length">
            <div class="item" v-for="msg in historyMsgList">
              <div class="img">
                <img :src="msg.fromAvatar" alt="" />
              </div>
              <div class="info">
                <div class="row">
                  <span class="name">{{ msg.fromNickname }}</span>
                  <span class="time">
                    <TimesTransform
                      v-if="msg.timestamp"
                      :timestamp="msg.timestamp"
                    />
                  </span>
                </div>
                <div class="msg-row">
                  <span class="message">
                    <HistoryMsgCard :msg="msg" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-bg" v-else>
            <img :src="LsAssets.emptyData" alt="" />
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { LsIcon, TimesTransform, LsAssets } from '@lanshu/components';
import { lodash, MSG_FORMAT_MAP } from '@lanshu/utils';
import { mapGetters } from 'vuex';
import { IMSearchMessageByMsgType, IMSearchMessageOfText } from '../../IM-SDK';
import DrawerMixins from './drawer-mixins';
import HistoryMsgCard from './history-msg-card.vue';

const TAB_TYPE = {
  IS_KEYWORDS: 1,
  IS_FILE: 3,
  IS_IMAGE: 2,
  IS_VIDEO: 4,
  IS_AUDIO: 5,
};

export default {
  name: 'HistoryMsg',
  mixins: [DrawerMixins],
  props: {},
  components: {
    LsIcon,
    TimesTransform,
    HistoryMsgCard,
  },
  data() {
    return {
      LsAssets,
      MSG_FORMAT_MAP,
      TAB_TYPE,
      tabType: TAB_TYPE.IS_KEYWORDS,
      keywords: '',
      historyMsgList: [],
      hasNext: true,
      nextSeq: 0,
      scrollTop: 0,
      preScrollHeight: 0,
      throttleGetHistoryMsgList: null,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['actionWindow']),
  },
  watch: {
    visibleDrawer(val) {
      if (val) {
        this.handleChooseTab(TAB_TYPE.IS_KEYWORDS);
      }
    },
  },
  mounted() {
    this.throttleGetHistoryMsgList = lodash.throttle(
      this.getHistoryMsgList,
      200,
      {
        leading: true,
        trailing: false,
      },
    );
    if (this.visibleDrawer) {
      this.throttleGetHistoryMsgList(false);
    }
  },
  methods: {
    handleChooseTab(type) {
      this.historyMsgList = [];
      this.keywords = '';
      this.tabType = type;
      this.throttleGetHistoryMsgList(false);
    },

    handleSearchKeywords: lodash.debounce(function () {
      this.nextSeq = 0;
      this.getHistoryMsgList();
    }, 400),

    getHistoryMsgList(isContinue = false) {
      if (!isContinue) {
        this.nextSeq = 0;
      }

      const isKeywords = this.tabType === TAB_TYPE.IS_KEYWORDS;

      const fetchFnc = isKeywords
        ? IMSearchMessageOfText
        : IMSearchMessageByMsgType;

      fetchFnc(
        this.actionWindow.sessId,
        isKeywords ? this.keywords : this.tabType,
        this.nextSeq,
      ).then((res) => {
        console.log('拉取成功', res.data);
        const { msgs, nextSeq, hasNext } = res?.data || {};
        this.hasNext = hasNext;
        this.nextSeq = nextSeq;
        if (isContinue && this.historyMsgList?.length) {
          this.historyMsgList.unshift(...msgs);
          this.$nextTick(() => {
            const currentScrollHeight = this.$refs.historyMsgList.scrollHeight;
            this.$refs.historyMsgList.scrollTop =
              currentScrollHeight - this.preScrollHeight + this.scrollTop;
          });
        } else {
          this.historyMsgList = msgs;
          this.$nextTick(() => {
            this.$refs.historyMsgList.scrollTop =
              this.$refs.historyMsgList.scrollHeight;
          });
        }
      });
    },

    handleScroll: lodash.throttle(
      function (event) {
        if (!this.hasNext) return;
        const scrollTop = event.target.scrollTop;
        if (
          scrollTop <= 500 &&
          (scrollTop <= this.scrollTop || this.scrollTop === 0)
        ) {
          this.preScrollHeight = this.$refs.historyMsgList.scrollHeight;
          this.scrollTop = scrollTop;
          this.throttleGetHistoryMsgList(true);
        }
      },
      200,
      {
        leading: true,
        trailing: false,
      },
    ),
  },
};
</script>

<style scoped lang="scss">
.history-msg {
  ::v-deep .el-drawer__body {
    width: 100%;
    height: calc(100% - 177px);
    box-sizing: border-box;
    overflow: hidden;
  }

  .drawer-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .tabs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 26px;

      font-size: 14px;
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

    .search-row {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
    }

    .history-msg-list {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      transform: translate3d(0, 0, 0);
      padding: 0 20px;
      box-sizing: border-box;

      .scroll-view {
        .item {
          width: 260px;
          min-height: 58px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid $split-line-color;

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
            margin-left: 10px;

            .row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 4px;
              width: 100%;
              font-size: 12px;
              color: $tips-text-color;

              .name {
                height: 18px;
                width: 120px;
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .time {
                font-size: 12px;
                font-weight: normal;
              }
            }

            .msg-row {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;

              .message {
                width: 210px;
                font-size: 14px;
              }
            }
          }
        }
      }

      .empty-bg {
        img {
          display: block;
          width: 200px;
          height: 200px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -60%);
        }
      }
    }
  }
}
</style>
