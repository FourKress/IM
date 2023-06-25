import regexUtils from '../regex';
import { unFormatPhoneNum } from '../base';

export default {
  data() {
    return {};
  },

  computed: {
    validPhoneNum() {
      return regexUtils.phone.test(unFormatPhoneNum(this.form.phoneNum));
    },
  },

  methods: {
    validateFormValue(rule, value, callback) {
      if (!value || !unFormatPhoneNum(value)) {
        return callback(new Error('请输入有效的电话号码'));
      }
      if (!regexUtils.phone.test(unFormatPhoneNum(value))) {
        return callback(new Error('请输入有效的电话号码'));
      }
      return callback();
    },
  },
};
