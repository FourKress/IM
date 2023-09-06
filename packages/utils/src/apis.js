import https from './https';
import { renderProcess } from '@lanshu/render-process';
import { getToken } from './token';
import { TOKEN_TYPE } from './constant';

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

export const accountLoginOut = () => {
  return https.post('/auth/account/loginOut', {
    token: getToken(TOKEN_TYPE.IS_SYS),
  });
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

export const accountUserInfo = async (params) => {
  return https.post('/auth/user/userInfo', {
    ...params,
    terminal: await getTerminal(),
    token: getToken(TOKEN_TYPE.IS_SYS),
  });
};

export const accountUpdateUserInfo = async (params) => {
  return https.post('/auth/user/updateUserInfo', {
    ...params,
    terminal: await getTerminal(),
    token: getToken(TOKEN_TYPE.IS_SYS),
  });
};

export const accountUpdatePhone = async (params) => {
  return https.post('/auth/user/updatePhone', {
    ...params,
    terminal: await getTerminal(),
    token: getToken(TOKEN_TYPE.IS_SYS),
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

export const accessibleDeparts = async () => {
  return https.post('/auth/platform/accessibleDeparts', {
    token: getToken(TOKEN_TYPE.IS_SYS),
    terminal: await getTerminal(),
  });
};

export const findUserByDepartId = async (params) => {
  return https.post('/auth/platform/findUserByDepartId', {
    ...params,
    terminal: await getTerminal(),
  });
};

export const technicalSupportList = async () => {
  return https.post('/auth/user/technicalSupportList', {
    terminal: await getTerminal(),
  });
};

export const queryLastAvailableByAppCode = async (params) => {
  return https.post('/auth/appRelease/queryLastAvailableByAppCode', {
    ...params,
    terminal: await getTerminal(),
  });
};

export const userDepartList = async () => {
  return https.post('/auth/depart/userDepartList', {
    token: getToken(TOKEN_TYPE.IS_SYS),
    terminal: await getTerminal(),
  });
};

export const userDepartAndOrganization = async (params) => {
  return https.post('/auth/user/userDepartAndOrganization', {
    ...params,
    terminal: await getTerminal(),
  });
};

export const userQueryByOrgId = async (params) => {
  return https.post('/auth/user/userQueryByOrgId', {
    ...params,
    terminal: await getTerminal(),
  });
};

export const getPublicKey = async () => {
  return https.post('/auth/auth/publicKey');
};
