import https from './https';
import { renderProcess } from '@lanshu/render-process';

const getTerminal = async () => await renderProcess.getStore('CLIENT_TERMINAL');

export const accountCheckStatus = async (params) => {
  return https.post(
    '/auth/account/checkStatus',
    { ...params, terminal: await getTerminal() },
    {
      isAuth: false,
    },
  );
};

export const accountSendCaptcha = async (params) => {
  return https.post(
    '/auth/account/sendCaptcha',
    {
      ...params,
      terminal: await getTerminal(),
    },
    {
      isAuth: false,
    },
  );
};

export const accountSetPassword = async (params) => {
  return https.post(
    '/auth/account/setPassword',
    {
      ...params,
      terminal: await getTerminal(),
    },
    {
      isAuth: false,
    },
  );
};

export const accountLogin = async (params) => {
  return https.post(
    '/auth/account/login',
    {
      ...params,
      terminal: await getTerminal(),
    },
    {
      isAuth: false,
    },
  );
};

export const accountQueryPermision = (params) => {
  return https.post('/auth/account/queryPermision', params);
};

export const accountLoginOut = (params) => {
  return https.post('/auth/account/loginOut', params);
};

export const accountCheckCaptcha = async (params) => {
  return https.post(
    '/auth/account/checkCaptcha',
    {
      ...params,
      terminal: await getTerminal(),
    },
    {
      isAuth: false,
    },
  );
};

export const accountLoginWithCaptcha = async (params) => {
  return https.post(
    '/auth/account/loginWithCaptcha',
    {
      ...params,
      terminal: await getTerminal(),
    },
    {
      isAuth: false,
    },
  );
};

export const accountUserInfo = (params) => {
  return https.post('/auth/user/userInfo', params);
};

export const accountUpdateUserInfo = async (params) => {
  return https.post('/auth/user/updateUserInfo', {
    ...params,
    terminal: await getTerminal(),
  });
};

export const accountUpdatePhone = async (params) => {
  return https.post('/auth/user/updatePhone', {
    ...params,
    terminal: await getTerminal(),
  });
};

export const managerFileUpload = (params) => {
  return https.post('/manager/common/file/upload', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const managerRegionQuery = (params) => {
  return https.post('/manager/region/query', params);
};

export const managerRegionQueryAsTree = (params) => {
  return https.post('/manager/region/queryAsTree', params);
};
