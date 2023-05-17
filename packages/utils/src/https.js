import axios from 'axios';
import qs from 'qs';
import { getToken } from './token';
import { storeInstance } from './store';

const DEFAULT_HTTP_OPTIONS = {
  baseURL: 'http://172.16.2.245:9000',
  timeout: 20000,
  withCredentials: false,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
};

const HEADER_AUTH = 'Authorization';

const instance = axios.create(DEFAULT_HTTP_OPTIONS);

instance.interceptors.request.use(
  (config) => {
    const {
      method,
      // 是参数处否是否吧理成formData形式
      serialize,
      // 是否传递Authorization
      isAuth = true,
    } = config;
    let { data, params } = config;

    const authToken = getToken('SYS_TOKEN');
    if (isAuth && authToken) {
      config.headers[HEADER_AUTH] = authToken;
    }

    config.headers['os'] = 'pc';

    if (serialize) {
      if (data) data = qs.stringify(data);
      if (params) data = qs.stringify(params);
    }
    config.data = data;
    config.params = params;
    config.method = method.toLowerCase();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  async (response) => {
    const { config, data } = response;
    const { url } = config;
    let { code, msg } = data || {};
    if (code !== '00000') {
      if (url.includes('/auth/account/loginOut')) {
        return data;
      }
      const codeList = ['10014'];
      if (codeList.includes(code)) {
        storeInstance.commit('globalStore/setUserErrorMsg', msg);
      } else {
        window.ClientMessage.error(msg);
      }
      return Promise.reject(data);
    }
    return Promise.resolve(data);
  },
  (error) => {
    const { response, request, message } = error;
    if (message.includes('timeout of')) {
      console.log('响应超时');
      window.ClientMessage.error('请求超时');
    } else if (message.includes('Network Error')) {
      console.log('网络出错：Network Error');
      window.ClientMessage.error('网络连接异常');
    } else if (response) {
      const { status, data } = response;
      let { msg } = data || {};
      if (status === 200) {
        // 正常
      } else if (status === 401) {
        console.log('请求401: 无权限');
        msg = '系统错误，请稍候再试！';
        console.log(msg);
      } else if (status === 403) {
        msg = '系统错误，请稍候再试！';
        console.log(msg);
      } else if (status === 404) {
        msg = '系统错误，请稍候再试！';
        console.log(msg);
      } else if (status === 500) {
        msg = '系统错误，请稍候再试！';
        console.log(msg);
      } else {
        msg = '系统错误，请稍候再试！';
        console.log(msg);
      }
      window.ClientMessage.error(msg);
    } else if (request) {
      console.log('request====>', request);
    } else {
      console.log('error.message', message);
    }
    return Promise.reject(error);
  },
);

export default instance;
