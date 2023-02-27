import { renderProcess } from '@lanshu/render-process';
import { removeToken } from './token';

export const IMSDKMainProvide = {
  provider: 'getMainProvider',
  events: {
    login: 'login',
    logout: 'logout',
  },
};

export const IMSDKUserProvider = {
  provider: 'getUserProvider',
  events: {
    getUserAttribute: 'getUserAttrbute',
  },
};

export const IMSDKConvProvider = {
  provider: 'getConvProvider',
  events: {
    login: 'login',
    setLogLevel: 'setLogLevel',
  },
};

export const IMSDKMessageProvider = {
  provider: 'getMessageProvider',
  events: {
    login: 'login',
    setLogLevel: 'setLogLevel',
  },
};

export const IMSDKGroupProvider = {
  provider: 'getGroupProvider',
  events: {
    login: 'login',
    setLogLevel: 'setLogLevel',
  },
};

export const IMSDKCallBackEvents = {
  // ''
};

export const IMLogout = async () => {
  await renderProcess.IMSDKIPC(
    IMSDKMainProvide.provider,
    IMSDKMainProvide.events.logout,
  );
};

export const ClientLogOut = async () => {
  await IMLogout();
  removeToken();
  window.location.reload();
  renderProcess.showLoginWindow(500);
};
