import https from './https';
import { renderProcess } from '@lanshu/render-process';

const terminal = await renderProcess.getStore('CLIENT_TERMINAL');

export const accountCheckStatus = (params) => {
  return https.post(
    '/auth/account/checkStatus',
    { ...params, terminal },
    {
      isAuth: false,
    },
  );
};

export const accountSendCaptcha = (params) => {
  return https.post(
    '/auth/account/sendCaptcha',
    {
      ...params,
      terminal,
    },
    {
      isAuth: false,
    },
  );
};

export const accountSetPassword = (params) => {
  return https.post(
    '/auth/account/setPassword',
    {
      ...params,
      terminal,
    },
    {
      isAuth: false,
    },
  );
};

export const accountLogin = (params) => {
  return https.post(
    '/auth/account/login',
    {
      ...params,
      terminal,
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

export const accountCheckCaptcha = (params) => {
  return https.post(
    '/auth/account/checkCaptcha',
    {
      ...params,
      terminal,
    },
    {
      isAuth: false,
    },
  );
};

export const accountLoginWithCaptcha = (params) => {
  return https.post(
    '/auth/account/loginWithCaptcha',
    {
      ...params,
      terminal,
    },
    {
      isAuth: false,
    },
  );
};

export const accountUserInfo = (params) => {
  return https.post('/auth/user/userInfo', params);
};

export const accountUpdateUserInfo = (params) => {
  return https.post('/auth/user/updateUserInfo', { ...params, terminal });
};

export const accountUpdatePhone = (params) => {
  return https.post('/auth/user/updatePhone', { ...params, terminal });
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
