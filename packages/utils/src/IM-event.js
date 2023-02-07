const IMLogin = (token) => {
  console.log(token);
  IMSDK.login({
    lt: token,
  })
    .then((e) => {
      if (e.code === 0) {
        this.$message.error('IM 登录成功');
        console.log('登录成功');
      } else {
        console.log('IM 登录失败');
        this.$message.error('IM 登录失败');
      }
    })
    .catch((e) => {
      console.log('IM 登录失败，错误码：', e.code);
    });
};

const IMLogout = async () => {
  await IMSDK.logout();
};

const IMDestroy = () => {
  IMSDK.destroy();
};

export { IMLogin, IMLogout, IMDestroy };
