import { setToken, TOKEN_TYPE } from '@lanshu/utils';
import { microShared } from '@lanshu/micro';
import { renderProcess } from '@lanshu/render-process';
import { IMSDK_Init } from '@lanshu/im';
import { mapActions } from 'vuex';

export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions('globalStore', ['setSystemUserInfo']),
    ...mapActions('routerStore', ['clearBreadCrumb']),

    async handleClientLogin(res) {
      const resData = res?.data || {};
      await this.setSystemUserInfo(resData);

      const { imAppid, imToken, token, userId } = resData;

      setToken(TOKEN_TYPE.IS_IM, imToken);
      setToken(TOKEN_TYPE.IS_SYS, token);

      // const imAppid = 'imAppid';
      // const imToken =
      //   'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiI4ODg4ODg4IiwiZXhwaXJlIjotMSwic2lnbiI6IjVKT0d1VmJPL2VyelVibjc5N2xOUkdhMU1qMzA5bi9oTFNqRjdjemJWQkk9In0=';
      // const imToken =
      //   'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiI5OTk5OTk5IiwiZXhwaXJlIjotMSwic2lnbiI6InlBV3pid3orS1FrUUdRb3JIWU5RL1RNRTJpa093cURBSUozNzVHN3BVMzQ9In0=';
      // const imToken = 'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiIxMjM0NTQzMjEiLCJleHBpcmUiOi0xLCJzaWduIjoiNTZjZUZrVWVJSjhpcUkzdENtQ0dRWFUvRldEdkFCMXNJZm5FeVhiK0plQT0ifQ==';
      // setToken(TOKEN_TYPE.IS_IM, imToken);

      try {
        await renderProcess.IMSDK_INIT(imAppid);
        await IMSDK_Init({
          token: imToken,
          userId,
          // userId: '8888888',
          // userId: '9999999',
          // userId: '123454321',
        });
        microShared.setToken(token);
        this.$router.push('/');
        await this.clearBreadCrumb();
        await renderProcess.showMainWindow();
      } catch (e) {}
    },
  },
};
