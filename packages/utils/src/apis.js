import https from './https';

export const accountCheckStatus = (params) => {
  return https.post('/auth/account/checkStatus', params);
};

export const accountSendCaptcha = (params) => {
  return https.post('/auth/account/sendCaptcha', params);
};

export const accountSetPassword = (params) => {
  return https.post('/auth/account/setPassword', params);
};

export const accountLogin = (params) => {
  return https.post('/auth/account/login', params);
};

export const accountQueryPermision = (params) => {
  return https.post('/auth/account/queryPermision', params);
};

export const accountLoginOut = (params) => {
  return https.post('/auth/account/loginOut', params);
};

export const accountCheckCaptcha = (params) => {
  return https.post('/auth/account/checkCaptcha', params);
};

export const accountLoginWithCaptcha = (params) => {
  return https.post('/auth/account/loginWithCaptcha', params);
};

export const accountUserInfo = (params) => {
  return https.post('/auth/user/userInfo', params);
};

export const accountUpdateUserInfo = (params) => {
  return https.post('/auth/user/updateUserInfo', params);
};

export const accountUpdatePhone = (params) => {
  return https.post('/auth/user/updatePhone', params);
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
