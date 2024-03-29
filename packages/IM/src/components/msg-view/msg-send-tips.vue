<template>
  <div
    class="msg-send-tips"
    :class="
      isSelf && bubbleModel === SESSION_BUBBLE_MODEL.IS_BETWEEN
        ? 'self'
        : 'target'
    "
  >
    <template v-if="rawMsg.sendState !== 1">
      <img
        class="loading-icon"
        v-if="rawMsg.sendState === 0"
        :src="LsAssets.loadingIcon"
        alt=""
      />
      <span
        class="send-error"
        v-if="rawMsg.sendState === -1"
        @click="handleResendMsg"
      >
        <LsIcon
          render-svg
          width="17"
          height="17"
          icon="a-zt_ts_icon2x"
        ></LsIcon>
      </span>
    </template>

    <template v-if="showTips">
      <el-popover
        placement="top-end"
        title=""
        width="284"
        trigger="click"
        popper-class="tips-member-panel"
        :disabled="!isGroup"
      >
        <span slot="reference" @click="checkGroupMember">
          <i
            class="el-icon-circle-check"
            v-if="receiptUserList.length === realMemberCount"
          ></i>
          <div
            class="progress-bar"
            :style="{
              borderColor: receiptUserList.length ? '#00C476' : '#DBDEE4',
            }"
            v-else
          >
            <div
              class="bar"
              :style="{
                background: `conic-gradient(#00c476 0, #00c476 ${percent}%, #fff ${percent}%, #fff)`,
              }"
            ></div>
          </div>
        </span>

        <div class="tips-member-list" v-loading="loading">
          <div class="left">
            <div class="top-title">
              <span class="count">{{ readMember.length }}</span>
              <span>已读</span>
            </div>
            <div class="list">
              <MemberItem
                v-for="item in readMember"
                :key="item.userId"
                :member="item"
                @checkMember="checkMember"
              />
            </div>
          </div>
          <div class="right">
            <div class="top-title">
              <span class="count">{{ notReadMember.length }}</span>
              <span>未读</span>
            </div>
            <div class="list">
              <MemberItem
                v-for="item in notReadMember"
                :key="item.userId"
                :member="item"
                @checkMember="checkMember"
              />
            </div>
          </div>
        </div>
      </el-popover>
    </template>
  </div>
</template>

<script>
import { LsIcon, LsAssets } from '@lanshu/components';
import {
  SESSION_BUBBLE_MODEL,
  SESSION_USER_TYPE,
  CHECK_MSG_TYPE,
  MSG_FORMAT_MAP,
} from '@lanshu/utils';
import { IMGetGroupMemberList } from '../../IM-SDK';
import { mapGetters } from 'vuex';

export default {
  name: 'Msg-send-tips',
  props: {
    rawMsg: {
      type: Object,
      required: true,
      default: () => {},
    },
    bubbleModel: {
      type: [Number, String],
      default: SESSION_BUBBLE_MODEL.IS_BETWEEN,
    },
    isSelf: {
      type: Boolean,
      required: true,
      default: true,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    session: {
      type: Object,
      default: () => {},
      require: true,
    },
  },
  components: {
    LsIcon,
    MemberItem: {
      functional: true,
      render: (h, ctx) => {
        const { props, listeners } = ctx;
        const { member } = props;
        const { checkMember } = listeners;
        const render = () => {
          return (
            <div class="item" onClick={(event) => checkMember(member, event)}>
              <img class="avatar" src={member.avatar} alt="" />
              <span class="name">{member.nickname}</span>
            </div>
          );
        };
        return render();
      },
    },
  },
  data() {
    return {
      LsAssets,
      SESSION_BUBBLE_MODEL,
      CHECK_MSG_TYPE,
      MSG_FORMAT_MAP,
      readMember: [],
      notReadMember: [],
      callbackReceiptUserList: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'refreshReceipt']),

    receiptUserList() {
      return [
        ...new Set([
          ...(this.rawMsg?.receiptUserList || []),
          ...this.callbackReceiptUserList,
        ]),
      ];
    },
    percent() {
      const percent =
        (this.receiptUserList.length / this.realMemberCount) * 100;
      return percent ? percent + 0.2 : percent;
    },
    isGroup() {
      return this.rawMsg.toUserType === SESSION_USER_TYPE.IS_GROUP;
    },
    realMemberCount() {
      // 总人数需要排除自己 所以 减 1
      return this.isGroup ? this.memberCount - 1 : 1;
    },
    msgType() {
      const msgType = this.rawMsg?.msgType;
      return MSG_FORMAT_MAP[msgType].type;
    },
    showTips() {
      return (
        this.isSelf &&
        this.msgType !== CHECK_MSG_TYPE.IS_TRTC &&
        this.rawMsg.sendState === 1 &&
        this.session.toUser !== this.session.userId
      );
    },
  },
  watch: {
    refreshReceipt: {
      deep: true,
      handler(val) {
        const targetList = val?.filter((d) => d.msgId === this.rawMsg.msgId);
        if (!targetList.length) return;
        this.callbackReceiptUserList.push(...targetList.map((d) => d.userId));
      },
    },
  },
  created() {},
  methods: {
    checkGroupMember() {
      if (!this.isGroup) return;
      this.getGroupMemberList();
    },

    getGroupMemberList() {
      this.loading = true;
      // nextSeq默认从0开始
      IMGetGroupMemberList(this.session.toUser, 0)
        .then((res) => {
          this.readMember = [];
          this.notReadMember = [];
          const { members = [] } = res;
          members
            .filter((d) => d.userId !== this.userInfo.userId)
            .forEach((d) => {
              const member = {
                ...d,
                nickname: d.alias || d.nickname,
              };

              if (this.receiptUserList.some((r) => r === d.userId)) {
                this.readMember.push(member);
              } else {
                this.notReadMember.push(member);
              }
            });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    checkMember(member, event) {
      this.$emit(
        'checkMember',
        {
          userId: member.userId,
        },
        event,
      );
    },

    handleResendMsg() {
      // TODO
      console.log('重发');
    },
  },
};
</script>

<style scoped lang="scss">
.msg-send-tips {
  position: absolute;
  bottom: 0;

  &.self {
    left: -25px;
  }

  &.target {
    right: -25px;
  }

  .loading-icon {
    display: block;
    width: 15px;
    height: 15px;
    transform-origin: center;
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

  .send-error {
    display: flex;
    cursor: pointer;
  }

  .progress-bar {
    border: 2px solid #dbdee4;
    cursor: pointer;
    width: 15px;
    height: 15px;
    box-sizing: border-box;
    padding: 2px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .bar {
      flex: 1;
      height: 7px;
      border-radius: 50%;
    }
  }

  .el-icon-circle-check {
    color: #00c476;
    font-size: 15px;
    font-weight: bold;
    display: block;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.tips-member-panel {
  width: 294px !important;
  z-index: 7 !important;

  .tips-member-list {
    width: 294px;
    display: flex;
    align-items: flex-start;
    height: 336px;
    max-height: 336px;
    overflow: hidden;

    .left,
    .right {
      width: calc(50% - 6px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;

      .top-title {
        color: $main-text-color;
        font-size: 14px;
        display: flex;
        align-items: baseline;
        padding-bottom: 10px;

        .count {
          font-size: 20px;
          padding-right: 6px;
        }
      }

      .list {
        padding: 0 4px;
        flex: 1;
        box-sizing: border-box;
        overflow-y: auto;

        .item {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          cursor: pointer;

          .avatar {
            border-radius: 3px;
            width: 24px;
            height: 24px;
            display: block;
          }

          .name {
            flex: 1;
            padding-left: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            color: $main-text-color;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .right {
      border-left: 1px solid $split-line-color;
      padding-left: 12px;
    }
  }
}
</style>
