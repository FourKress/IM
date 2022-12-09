<template>
  <div id="login">
    <div class="image"></div>
    <div class="operate-panel" @click="handleLogin">登录</div>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import { token } from '@lanshu/utils';

export default {
  name: 'Login',
  created() {
    renderProcess.showLoginWindow();
  },
  methods: {
    handleLogin() {
      renderProcess.showMainWindow();
      token.setToken('12312');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped lang="scss">
#login {
  width: 100%;
  height: 100%;

  background-color: #d8d8d8;
}
</style>
