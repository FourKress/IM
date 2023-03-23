import { regexUtils } from '../../lib/main';

export default {
  data() {
    return {};
  },

  computed: {
    validPhoneNum() {
      return regexUtils.phone.test(this.replacePhoneNum());
    },
  },

  methods: {
    validateFormValue(rule, value, callback) {
      if (!value || !this.replacePhoneNum()) {
        return callback(new Error('请输入有效的电话号码'));
      }
      if (!regexUtils.phone.test(this.replacePhoneNum())) {
        return callback(new Error('请输入有效的电话号码'));
      }
      return callback();
    },

    replacePhoneNum() {
      const phoneNum = this.form.phoneNum;
      if (!phoneNum) return phoneNum;
      return phoneNum.replace(/ /g, '');
    },
  },
};
