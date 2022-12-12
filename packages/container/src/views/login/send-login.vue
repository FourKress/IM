<template>
  <div class="send-login"></div>
</template>

<script>
import { token } from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { IMMixin } from '@lanshu/im';

export default {
  name: 'Send-login',
  mixins: [IMMixin],
  methods: {
    handleLogin() {
      this.initIM();
      renderProcess.showMainWindow();
      token.setToken('12312');
      this.$router.push('/');
    },
    initIM() {
      this.IM_init(
        // 'eyJhcHBJZCI6IjYzNmNhMzFiZDRjYTM1MmJmMWZmNjQxZSIsImFwcFVzZXIiOiIxMjM0NTQzMjEiLCJleHBpcmUiOi0xLCJzaWduIjoiZWpzcWNBS1RaV2lNaThCdzZFZlAzcmRMOERYTzFyQytzbzFLQjd5bWxqOD0ifQ==',
        'eyJhcHBJZCI6IjYzNmNhMzFiZDRjYTM1MmJmMWZmNjQxZSIsImFwcFVzZXIiOiI4ODg4ODg4IiwiZXhwaXJlIjotMSwic2lnbiI6IlByTkhyVlRkTjNZL3RqWmkrV1pGejNIYndNLzBhc2VKS1RJMkgrRGlpaE09In0=',
      );
    },
  },
};
</script>

<style scoped lang="scss"></style>
