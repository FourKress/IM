/**
 * 常用的正则表达式合集
 * */

export default {
  // 手机号码：宽松
  phone: /^1[0-9]{10}$/,
  // 座机号码
  tel: /^0[0-9]{2,3}-[0-9]{7,8}$/,
  // 手机和座机
  telPhone: /^(0[0-9]{2,3}-[0-9]{7,8})|(1[0-9]{10})$/,
  // 数字
  number: /^[0-9]+(\.[0-9]+)?$/,
  // 非两位以内小数
  money: /^[0-9]+(\.[0-9]{3,})$/,
  // 验证正确只有数字以及小数点
  moneyTrue: /^[0-9]+(\.*[0-9]*)$/,
  // code或者数字
  numberLetter: /^[a-zA-Z0-9]*$/,
  // 邮箱
  email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
  // 身份证号码：宽松
  idNo: /^\d{17}[\dX]$/,
  // 匹配获取url中域名地址
  url: /https{0,1}:\/\/([a-zA-Z\.]*)\/*/,
};