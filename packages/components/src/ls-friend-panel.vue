<template>
  <div class="friend-dialog" :style="position">
    <div class="top">
      <img :src="LsAssets.topBg" alt="" />

      <div class="info">
        <div class="avatar">
          <img :src="friendInfo.avatar" class="img" />
        </div>
        <div class="right">
          <span class="nickname">{{ friendInfo.nickname }}</span>
          <span class="tips">
            <LsUserTag
              bgColor="#fff"
              color=""
              :age="calculateAgeByBirthday(friendInfo.birthday)"
              :sex="friendInfo.sex"
              address="重庆渝北"
            ></LsUserTag>
          </span>
        </div>
      </div>

      <div
        class="more-btn"
        v-if="
          !isBot &&
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
<!--            <el-dropdown-item :command="isShared">-->
<!--              <div class="send-down-row">-->
<!--                <LsIcon size="14" icon="pop_cd_cjql"></LsIcon>-->
<!--                <span>转发名片</span>-->
<!--              </div>-->
<!--            </el-dropdown-item>-->
            <el-dropdown-item :command="isDelete">
              <div class="send-down-row">
                <LsIcon size="14" color="red" icon="pop_cd_sz"></LsIcon>
                <span style="color: red">删除好友</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="wrap">
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
            <!--            <div class="item">-->
            <!--              阿萨打撒十大打算鲁大师鲁大师-->
            <!--            </div>-->
            <div class="item">
              {{ friendInfo.message }}
            </div>
          </div>
        </div>
      </div>
      <div class="btn" v-if="panelConfig.isApply" @click="handleSendApply">
        发送申请
      </div>
      <div class="btn" v-if="panelConfig.isAuth" @click="handleSendAuth">
        通过验证
      </div>
      <template v-if="panelConfig.isExpired">
        <div class="btn expired">通过验证</div>
        <p class="expired-tips">
          <span>好友申请已过期，你可以发起</span>
          <span class="link" @click="handleResetApply">好友申请</span>
        </p>
      </template>
      <div class="btn-list" v-if="panelConfig.isPass">
        <div class="action-btn left" @click="handleSendMsg">发信息</div>
        <div class="action-btn" @click="handleSendVideo">视频</div>
        <div class="action-btn" @click="handleSendAudio">语音</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { addFriendType, calculateAgeByBirthday } from '@lanshu/utils';
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
      isDelete: 'delete',
      isShared: 'shared',
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
  mounted() {
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
      this.$emit('sendAuth', [
        this.friendInfo.noticeId,
        this.remark,
        this.desc,
      ]);
    },
    handleSendApply() {
      this.$emit('sendApply', [
        this.friendInfo.userId,
        this.remark,
        this.desc,
        this.message,
        addFriendType.isSearch,
      ]);
    },
    handleSendMsg() {
      this.$emit('sendMsg');
    },
    handleSendVideo() {
      this.$emit('sendVideo');
    },
    handleSendAudio() {
      this.$emit('sendAudio');
    },
    handleResetApply() {
      this.$emit('resetApply');
    },
    handleCommand(command) {
      console.log(command);
      if (command === this.isDelete) {
        IMDelFriendOneWay(this.friendInfo.userId).then(() => {
          this.$message.success('好友删除成功');
          this.$emit('update');
        });
      }
    },
    async handleSetRemarkOrDesc() {
      if (!this.panelConfig.isPass) return;
      await IMSetRemarkOrDesc(this.friendInfo.userId, this.remark, this.desc);
      this.$emit('update')
    }
  },
};
</script>

<style scoped lang="scss">
.friend-dialog {
  width: 372px;
  min-height: 338px;
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
          margin-bottom: 10px;
        }

        .tips {
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

    .btn {
      height: 48px;
      line-height: 48px;
      background: $primary-color;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      color: $bg-white-color;
      text-align: center;
      margin: 52px 0 34px 0;

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
      margin: 147px 0 34px 0;

      .action-btn {
        width: 100px;
        border: 1px solid $main-text-color;
        height: 48px;
        line-height: 48px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        color: $main-text-color;
        text-align: center;
        box-sizing: border-box;

        &.left {
          background: $primary-color;
          border-color: $primary-color;
          color: $bg-white-color;
        }
      }
    }
  }
}
</style>
