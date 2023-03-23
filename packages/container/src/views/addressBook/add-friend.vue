<template>
  <div class="add-friend">
    <div class="search">
      <div class="input-panel">
        <el-form :model="form" :rules="rules" ref="form" label-width="0px">
          <el-form-item label="" prop="phoneNum">
            <el-input
              v-model="form.phoneNum"
              clearable
              maxlength="13"
              type="text"
              placeholder="输入手机号搜索"
            />
          </el-form-item>
        </el-form>
      </div>

      <span
        class="btn"
        :class="validPhoneNum && 'active'"
        @click="handleSearch"
      >
        搜索
      </span>
    </div>

    <div
      class="friend-row"
      v-if="friendInfo.nickname"
      @click="handleOpenFriendDialog"
    >
      <div class="left">
        <img class="img" src="" alt="" />
        <div class="info">
          <span class="name">{{ friendInfo.nickname }}</span>
          <span class="tips">大撒大撒大撒</span>
        </div>
      </div>
      <div class="right">
        <span>添加好友</span>
      </div>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <FriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="{ isApply: true }"
        @sendApply="handleSendApply"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { formatPhoneNum, regexUtils } from '@lanshu/utils';
import { LsCardDialog } from '@lanshu/components';
import FriendPanel from './friend-panel.vue';
import mixins from './mixins';

export default {
  name: 'Add-friend',
  mixins: [mixins],
  components: {
    LsCardDialog,
    FriendPanel,
  },
  data() {
    const validateFormValue = (rule, value, callback) => {
      if (!value || !this.replacePhoneNum()) {
        return callback(new Error('请输入有效的电话号码'));
      }
      if (!/\d/.test(this.replacePhoneNum())) {
        return callback(new Error('请输入有效的电话号码'));
      }
      return callback();
    };

    return {
      regexUtils,
      form: {
        phoneNum: '',
      },
      rules: {
        phoneNum: [
          { validator: validateFormValue, trigger: ['blur', 'change'] },
          {
            message: '请输入有效的电话号码',
            max: 13,
            min: 13,
            trigger: ['change', 'blur'],
          },
        ],
      },
    };
  },
  watch: {
    'form.phoneNum': function (val, oldVal) {
      const phoneNum = formatPhoneNum(val, oldVal);
      if (phoneNum) {
        this.form.phoneNum = phoneNum;
      }
    },
  },
  computed: {
    validPhoneNum() {
      return regexUtils.phone.test(this.replacePhoneNum());
    },
  },
  mounted() {
    this.msg = `我是${this.userInfo.nickname}`;
  },
  methods: {
    replacePhoneNum() {
      const phoneNum = this.form.phoneNum;
      if (!phoneNum) return phoneNum;
      return phoneNum.replace(/ /g, '');
    },
    handleSearch() {
      if (!this.validPhoneNum) return;
      this.friendInfo = {
        nickname: '啊实打实',
      };
    },
    handleOpenFriendDialog(event) {
      this.openFriendDialog(this.friendInfo, event);
    },
    handleSendApply() {
      this.handleCloseDialog()
    },
  },
};
</script>

<style scoped lang="scss">
.add-friend {
  margin-top: 48px;

  .search {
    width: 50%;
    height: 48px;
    margin: 0 auto;
    border-radius: 10px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 0 1px #0066ff;

    .input-panel {
      flex: 1;
      height: 40px;
      font-size: 14px;

      ::v-deep .el-form-item__content {
        .el-form-item__error {
          transform: translateY(5px);
        }

        .el-input {
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
    }

    .btn {
      cursor: pointer;
      margin-left: 8px;
      width: 80px;
      height: 39px;
      background: rgba(43, 131, 250, 0.35);
      border-radius: 8px;
      font-size: 14px;
      color: $bg-white-color;
      line-height: 39px;
      text-align: center;

      &.active {
        background: $primary-color;
      }
    }
  }

  .friend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 50%;
    height: 44px;
    padding: 12px 15px;
    margin: 10px auto 0;
    background: $bg-white-color;
    box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.1);
    border-radius: 10px;
    cursor: pointer;

    .right {
      font-size: 12px;
      color: $primary-hover-color;
    }

    .left {
      display: flex;
      align-items: center;

      .img {
        display: block;
        width: 46px;
        height: 46px;
        border-radius: 6px;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding-left: 8px;

        .name {
          font-size: 14px;
          font-weight: bold;
          color: $main-text-color;
          margin-bottom: 5px;
        }

        .tips {
          font-size: 12px;
          color: $tips-text-color;
        }
      }
    }
  }
}
</style>
