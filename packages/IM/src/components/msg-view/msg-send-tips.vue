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

    <template v-if="isSelf && rawMsg.sendState === 1">
      <i
        class="el-icon-circle-check"
        v-if="receiptUserList.length === memberCount"
      ></i>
      <div
        class="progress-bar"
        :style="{ borderColor: receiptUserList.length ? '#00C476' : '#999999' }"
        v-else
        @click="checkMember"
      >
        <div
          class="bar"
          :style="{
            background: `conic-gradient(#00c476 0, #00c476 ${percent}%, #fff ${percent}%, #fff)`,
          }"
        ></div>
      </div>
    </template>
  </div>
</template>

<script>
import { LsIcon, LsAssets } from '@lanshu/components';
import { SESSION_BUBBLE_MODEL } from '@lanshu/utils';
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
  components: { LsIcon },
  data() {
    return {
      LsAssets,
      SESSION_BUBBLE_MODEL,
      readMember: [],
      notReadMember: [],
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),

    receiptUserList() {
      return this.rawMsg?.receiptUserList || [];
    },
    percent() {
      // 总人数需要排除自己 所以 减 1
      return (this.receiptUserList.length / this.memberCount) * 100 + 0.2;
    },
  },
  watch: {},
  created() {},
  methods: {
    checkMember() {
      this.getGroupMemberList();
    },

    getGroupMemberList() {
      this.readMember = [];
      this.notReadMember = [];
      // nextSeq默认从0开始
      IMGetGroupMemberList(this.session.toUser, 0).then((res) => {
        const { members = [] } = res;
        members
          .filter((d) => d.userId !== this.userInfo.userId)
          .forEach((d) => {
            const member = {
              ...d,
              nickname: d.alias || d.nickname,
            };
            console.log(member.userId, this.receiptUserList);

            if (this.receiptUserList.some((r) => r === d.userId)) {
              console.log(1);
              this.readMember.push(member);
            } else {
              console.log(2);
              this.notReadMember.push(member);
            }
          });
      });
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
    width: 18px;
    height: 18px;
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
    border: 2px solid #00c476;
    cursor: pointer;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    padding: 2px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .bar {
      flex: 1;
      height: 10px;
      border-radius: 50%;
    }
  }

  .el-icon-circle-check {
    color: #00c476;
    font-size: 18px;
    font-weight: bold;
    display: block;
    cursor: pointer;
  }
}
</style>
