import { setToken, storeInstance, TOKEN_TYPE } from '@lanshu/utils';
import { microShared } from '@lanshu/micro';
import { renderProcess } from '@lanshu/render-process';
import {
  IMGetConvList,
  IMGetFriendRequestNoticeUnreadCount,
  IMGetTotalUnreadMessageCount,
  IMGetUserProfile,
  IMSDK_Init,
} from '@lanshu/im';
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

      const { imAppid, imToken, token, userId, username } = resData;

      localStorage.setItem('historyPhoneNum', username);
      setToken(TOKEN_TYPE.IS_IM, imToken);
      setToken(TOKEN_TYPE.IS_SYS, token);

      const autoLogin = (await renderProcess.getStore('AUTO_LOGIN')) || {};
      const { status = false } = autoLogin;
      await renderProcess.setStore('AUTO_LOGIN', {
        status: status,
        token: status ? token : '',
        expirationTime: Date.now(),
      });

      await renderProcess.IMSDK_INIT(imAppid);
      await IMSDK_Init({
        token: imToken,
        userId,
      });
      microShared.setToken(token);
      this.$router.push('/');
      await this.clearBreadCrumb();
      await renderProcess.showMainWindow();
      // 获取IM基础信息
      const userProfile = await IMGetUserProfile(userId);
      storeInstance.commit('IMStore/setUserProfile', userProfile.data);
      await IMGetConvList(userId);
      await IMGetTotalUnreadMessageCount();
      await IMGetFriendRequestNoticeUnreadCount();
    },
  },
};
