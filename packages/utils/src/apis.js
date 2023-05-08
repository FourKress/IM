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
