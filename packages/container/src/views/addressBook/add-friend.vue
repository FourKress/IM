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
        :class="regexUtils.phone.test(replacePhoneNum()) && 'active'"
      >
        搜索
      </span>
    </div>
  </div>
</template>

<script>
import { formatPhoneNum, regexUtils } from '@lanshu/utils';
export default {
  name: 'Add-friend',
  data() {
    const validateFormValue = (rule, value, callback) => {
      if (!value || !this.replacePhoneNum()) {
        return callback(new Error('请输入有效的电话号码'));
      }
      console.log(this.replacePhoneNum(), !/\d/.test(this.replacePhoneNum()));
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
  methods: {
    replacePhoneNum() {
      const phoneNum = this.form.phoneNum;
      if (!phoneNum) return phoneNum;
      return phoneNum.replace(/ /g, '');
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
}
</style>
