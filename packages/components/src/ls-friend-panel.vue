<template>
  <div
    class="friend-dialog"
    :style="position"
    v-loading="isLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <div class="top">
      <img :src="LsAssets.topBg" alt="" />

      <div class="info">
        <div class="avatar">
          <img :src="friendInfo.avatar" class="img" />
        </div>
        <div class="right">
          <span class="nickname">
            {{ friendInfo.remark ? friendInfo.remark : friendInfo.nickname }}
          </span>
          <span class="tips">
            <LsUserTag
              bgColor="#fff"
              color=""
              :age="calculateAgeByBirthday(friendInfo.birthday)"
              :sex="friendInfo.sex"
              :address="friendInfo.location"
            ></LsUserTag>
          </span>
        </div>
      </div>

      <div
        class="more-btn"
        v-if="
          !isBot &&
          !isDep &&
          !panelConfig.isApply &&
          !panelConfig.isAuth &&
          !panelConfig.isExpired
        "
      >
        <el-dropdown
          trigger="click"
          placement="bottom-end"
          @command="handleCommand"
        >
          <LsIcon render-svg icon="a-icon_more2x"></LsIcon>
          <el-dropdown-menu slot="dropdown">
            <!--            <el-dropdown-item :command="IS_SHARED">-->
            <!--              <div class="send-down-row">-->
            <!--                <LsIcon size="14" icon="pop_cd_cjql"></LsIcon>-->
            <!--                <span>转发名片</span>-->
            <!--              </div>-->
            <!--            </el-dropdown-item>-->
            <el-dropdown-item :command="IS_DELETE">
              <div class="send-down-row">
                <LsIcon
                  size="14"
                  color="red"
                  icon="ls-icon-icon_shanchu"
                ></LsIcon>
                <span style="color: red">删除好友</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="wrap">
      <div class="btn-list" v-if="panelConfig.isPass">
        <el-button
          class="action-btn left"
          @click="handleSendMsg"
          v-loading="isMsgAwait"
          element-loading-text=""
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, .7)"
        >
          <LsIcon
            render-svg
            width="20"
            height="20"
            icon="ls-icon-icon_xiaoxi_lan"
          ></LsIcon>
          <span class="btn-label">消息</span>
        </el-button>

        <el-button
          class="action-btn"
          @click="handleSendAudio"
          v-loading="isAudioAwait"
          element-loading-text=""
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, .7)"
        >
          <LsIcon
            render-svg
            width="20"
            height="20"
            icon="ls-icon-a-icon_yuyin2x"
          ></LsIcon>
          <span class="btn-label">语音</span>
        </el-button>

        <el-button
          class="action-btn"
          @click="handleSendVideo"
          v-loading="isVideoAwait"
          element-loading-text=""
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, .7)"
        >
          <LsIcon
            render-svg
            width="20"
            height="20"
            icon="ls-icon-icon_shipin1"
          ></LsIcon>
          <span class="btn-label">视频</span>
        </el-button>
      </div>

      <template v-if="!isDep">
        <div class="row">
          <span class="label sign-label">个性签名</span>
          <div class="input">
            <div class="sign">{{ friendInfo.description }}</div>
          </div>
        </div>
        <div class="row">
          <span class="label">备注名</span>
          <div class="input">
            <el-input
              class="friend-mark"
              type="text"
              :maxlength="10"
              placeholder="输入备注"
              :disabled="panelConfig.isExpired"
              @change="handleSetRemarkOrDesc"
              v-model="remark"
            ></el-input>
          </div>
        </div>
        <div class="row">
          <span class="label">描述</span>
          <div class="input">
            <el-input
              type="textarea"
              resize="none"
              :maxlength="100"
              :autosize="{ minRows: 1, maxRows: 3 }"
              placeholder="输入描述"
              :disabled="panelConfig.isExpired"
              @change="handleSetRemarkOrDesc"
              v-model="desc"
            ></el-input>
          </div>
        </div>
        <div class="row" v-if="!panelConfig.isPass && !panelConfig.isDetails">
          <span class="label">招呼</span>
          <div class="input">
            <el-input
              v-if="panelConfig.isApply"
              class="msg"
              type="textarea"
              resize="none"
              :maxlength="100"
              :rows="3"
              v-model="message"
            ></el-input>
            <div class="msg-list" v-else>
              <div class="item">
                {{ friendInfo.message }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="dep-info">
          <div class="dep-row">
            <span class="label">电话</span>
            <span class="text">aadsdsds</span>
          </div>
          <div class="dep-row">
            <span class="label">组织</span>
            <span class="text">aadsdsds</span>
          </div>
          <div class="dep-row">
            <span class="label">部门</span>
            <span class="text">aadsdsds</span>
          </div>
          <div class="dep-row">
            <span class="label">角色</span>
            <span class="text">aadsdsds</span>
          </div>
        </div>
      </template>

      <el-button
        class="btn"
        v-if="panelConfig.isApply"
        @click="handleSendApply"
        :loading="isAwait"
      >
        发送申请
      </el-button>

      <el-button
        class="btn"
        v-if="panelConfig.isAuth"
        @click="handleSendAuth"
        :loading="isAwait"
      >
        通过验证
      </el-button>

      <template v-if="panelConfig.isExpired">
        <div class="btn expired">通过验证</div>
        <p class="expired-tips">
          <span>好友申请已过期，你可以发起</span>
          <span class="link" @click="handleResetApply">好友申请</span>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ADD_FRIEND_TYPE, calculateAgeByBirthday } from '@lanshu/utils';
import { IMDelFriendOneWay, IMSetRemarkOrDesc } from '@lanshu/im';
import LsAssets from './assets';
import LsIcon from './ls-icon.vue';
import LsUserTag from './ls-user-tag.vue';

export default {
  name: 'Friend-Panel',
  props: {
    friendInfo: {
      type: Object,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
      default: () => {
        return {
          isExpired: false,
          isApply: false,
          isAuth: false,
          isPass: false,
          isDetails: false,
        };
      },
    },
    isBot: {
      type: Boolean,
      default: false,
    },
    isDep: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      LsAssets,
      message: '',
      desc: '',
      remark: '',
      defaultConfig: {
        isExpired: false,
        isApply: false,
        isAuth: false,
        isPass: false,
        isDetails: false,
      },
      IS_SHARED: 'IS_SHARED',
      IS_DELETE: 'IS_DELETE',
      isAwait: false,
      isMsgAwait: false,
      isVideoAwait: false,
      isAudioAwait: false,
      isLoading: false,
    };
  },
  components: {
    LsIcon,
    LsUserTag,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),

    panelConfig() {
      return {
        ...this.defaultConfig,
        ...this.config,
      };
    },
  },

  watch: {
    friendInfo: {
      deep: true,
      handler(val) {
        if (val?.userId) {
          this.isLoading = false;
        }
      },
    },
  },

  mounted() {
    setTimeout(() => {
      if (!this.friendInfo?.userId) {
        this.isLoading = true;
      }
    }, 200);
    if (this.panelConfig.isApply) {
      this.message = `我是${this.userInfo.nickname}`;
    }
    if (this.panelConfig.isDetails || this.panelConfig.isPass) {
      const { remark = '', desc = '' } = this.friendInfo;
      this.remark = remark;
      this.desc = desc;
    }
  },
  methods: {
    calculateAgeByBirthday,

    handleSendAuth() {
      this.isAwait = true;
      this.$emit('sendAuth', [
        this.friendInfo.noticeId,
        this.remark,
        this.desc,
      ]);
    },
    handleSendApply() {
      this.isAwait = true;
      this.$emit('sendApply', [
        this.friendInfo.userId,
        this.remark,
        this.desc,
        this.message,
        ADD_FRIEND_TYPE.IS_SEARCH,
      ]);
    },
    handleSendMsg() {
      this.isMsgAwait = true;
      this.$emit('sendMsg');
    },
    handleSendVideo() {
      this.isVideoAwait = true;
      this.$emit('sendVideo');
    },
    handleSendAudio() {
      this.isAudioAwait = true;
      this.$emit('sendAudio');
    },
    handleResetApply() {
      this.$emit('resetApply');
    },
    handleCommand(command) {
      console.log(command);
      if (command === this.IS_DELETE) {
        this.$Lconfirm({
          title: '提示',
          content: '你确定要删除该好友吗？',
        })
          .then(() => {
            IMDelFriendOneWay(this.friendInfo.userId).then(() => {
              this.$message.success('好友删除成功');
              this.$emit('update');
            });
          })
          .catch(() => {});
      }
    },
    async handleSetRemarkOrDesc() {
      if (!this.panelConfig.isPass && !this.panelConfig.isDetails) return;
      await IMSetRemarkOrDesc(this.friendInfo.userId, this.remark, this.desc);
      this.$emit('update');
    },
  },
};
</script>

<style scoped lang="scss">
.friend-dialog {
  width: 372px;
  min-height: 346px;
  background: $bg-white-color;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border-radius: 12px;
  border: 1px solid $split-line-color;
  overflow: hidden;
  position: fixed;
  z-index: 9;

  .top {
    width: 100%;
    height: 120px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      left: 25px;
      top: 50%;
      transform: translateY(-50%);

      .avatar {
        border-radius: 16px;
        border: 6px solid #ffffff;
        margin-right: 14px;

        .img {
          width: 66px;
          height: 66px;
          border-radius: 8px;
          display: block;
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .nickname {
          font-size: 18px;
          font-weight: bold;
          color: $main-text-color;
        }

        .tips {
          margin-top: 10px;
        }
      }
    }

    .more-btn {
      position: absolute;
      right: 14px;
      top: 10px;
      cursor: pointer;
    }
  }

  .wrap {
    width: 100%;
    padding: 27px 24px 0;
    box-sizing: border-box;

    .row {
      width: 100%;
      display: flex;
      align-items: flex-start;
      margin-bottom: 19px;
      min-height: 20px;

      &:last-child {
        margin-bottom: 69px;
      }

      ::v-deep .el-textarea__inner {
        font-family: inherit;
      }

      .msg {
        ::v-deep .el-textarea__inner {
          background: $bg-hover-grey-color;
        }
      }

      .label {
        font-size: 14px;
        color: $minor-text-color;
        padding-right: 12px;
        width: 56px;
        min-width: 56px;
        text-align: left;
        transform: translateY(7.5px);

        &.sign-label {
          transform: unset;
        }
      }

      .input {
        font-size: 14px;
        color: $tips-text-color;
        flex: 1;
        display: flex;
        align-items: flex-end;

        .msg-list {
          width: 100%;
          min-height: 54px;

          .item {
            background: $bg-hover-grey-color;
            border-radius: 4px;
            margin-bottom: 10px;
            font-size: 14px;
            color: $main-text-color;
            padding: 14px;
            box-sizing: border-box;
          }
        }

        .sign {
          font-size: 14px;
          color: $main-text-color;
          box-sizing: border-box;
        }

        .friend-mark {
          ::v-deep .el-input__inner {
            height: 33px;
          }
        }
      }
    }

    .dep-info {
      margin-bottom: 40px;
      .dep-row {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 16px;

        .label {
          color: $minor-text-color;
          padding-right: 26px;
        }

        .text {
          color: $main-text-color;
        }
      }
    }

    .btn {
      width: 100%;
      height: 48px;
      line-height: 48px;
      background: $primary-color;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      color: $bg-white-color;
      text-align: center;
      margin: 52px 0 34px 0;

      border: none;
      padding: 0;
      display: block;

      &.expired {
        background: #87a1cd;
        border-radius: 6px;
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .expired-tips {
      width: 100%;
      text-align: center;
      font-size: 14px;
      color: $tips-text-color;

      margin: -10px 0 24px 0;

      .link {
        color: $primary-color;
        cursor: pointer;
      }
    }

    .btn-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 12px 0 34px 0;

      .action-btn {
        width: 100px;
        background: $bg-IM-color;
        height: 48px;
        line-height: 48px;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        font-size: 16px;
        color: $main-text-color;
        box-sizing: border-box;
        padding: 0;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;

        ::v-deep > span {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          margin-left: 0;

          .btn-label {
            padding-left: 6px;
          }
        }

        &.left {
          color: $primary-color;
        }
      }
    }
  }
}
</style>
