<template>
  <div class="add-friend">
    <div class="search">
      <div class="input-panel">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="0px"
          @submit.native.prevent
          @keyup.enter.native="handleSearch"
        >
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

      <el-button
        class="btn"
        :class="validPhoneNum && 'active'"
        @click="handleSearch"
        :loading="isAwait"
      >
        搜索
      </el-button>
    </div>

    <div
      class="friend-row"
      v-if="friendList.length"
      v-for="item in friendList"
      :key="item.userId"
      @click="
        (event) =>
          item.userId !== userInfo.userId && handleOpenFriendDialog(item, event)
      "
    >
      <div class="left">
        <img class="img" :src="item.avatar" alt="" />
        <div class="info">
          <span class="name">{{ item.nickname }}</span>
          <span class="tips">{{ item.description }}</span>
        </div>
      </div>
      <div class="right">
        <span v-if="item.userId !== userInfo.userId">添加好友</span>
      </div>
    </div>

    <div class="empty-data" v-if="isEmpty">
      没有找到“
      <span class="link">{{ form.phoneNum }}</span>
      ”相关的结果
    </div>

    <div class=""></div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="friendPanelConfig"
        @sendApply="handleSendApply"
        @sendMsg="handleSendMsg"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import {
  formatPhoneNum,
  unFormatPhoneNum,
  regexUtils,
  PhoneNumMixins,
  FriendMixins,
} from '@lanshu/utils';
import { LsCardDialog, LsFriendPanel } from '@lanshu/components';
import { IMSearchUserProfileOfPhone, IMFriendAddRequest } from '@lanshu/im';
import { mapGetters } from 'vuex';

export default {
  name: 'Add-friend',
  mixins: [FriendMixins, PhoneNumMixins],
  components: {
    LsCardDialog,
    LsFriendPanel,
  },
  data() {
    return {
      regexUtils,
      form: {
        phoneNum: '',
      },
      rules: {
        phoneNum: [
          { validator: this.validateFormValue, trigger: ['blur', 'change'] },
          {
            message: '请输入有效的电话号码',
            max: 13,
            min: 13,
            trigger: ['change', 'blur'],
          },
        ],
      },
      friendList: [],
      isEmpty: false,
      isAwait: false,
      friendPanelConfig: { isApply: true },
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  watch: {
    'form.phoneNum': function (val, oldVal) {
      if (!val) this.handleClearSearch();

      const phoneNum = formatPhoneNum(val, oldVal);
      if (phoneNum) {
        this.form.phoneNum = phoneNum;
      }
    },
  },
  mounted() {
    this.msg = `我是${this.userInfo.nickname}`;
  },
  methods: {
    handleSearch() {
      if (!this.validPhoneNum) return;
      this.isAwait = true;
      IMSearchUserProfileOfPhone(unFormatPhoneNum(this.form.phoneNum))
        .then(({ data }) => {
          this.isAwait = false;
          this.friendList = data;
          this.isEmpty = !this.friendList.length && this.validPhoneNum;
        })
        .catch(() => {
          this.isAwait = false;
        });
    },
    async handleOpenFriendDialog(friendInfo, event) {
      await this.openFriendDialog(event, async () => {
        return {
          ...friendInfo,
        };
      });
      // 属于组织架构人员, 可直接发起聊天
      if (this.friendInfo?.dep) {
        this.friendPanelConfig = { isPass: true };
      }
    },
    handleSendApply(addParams) {
      IMFriendAddRequest(...addParams).then(() => {
        this.$message.success('添加好友成功');
        this.handleCloseDialog();
      });
    },
    handleClearSearch() {
      this.isEmpty = false;
      this.friendList = [];
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
    padding: 0 6px 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 0 1px $primary-color;

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
            font-weight: bold;
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

      border: none;
      padding: 0;
      display: block;

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

  .empty-data {
    height: 20px;
    font-size: 14px;
    margin: 200px auto 0;
    text-align: center;

    .link {
      color: $primary-color;
    }
  }
}
</style>
