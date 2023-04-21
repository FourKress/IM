import Vue from 'vue';
import localforage from 'localforage';
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { baseRoutes } from '@lanshu/container';
import { IMStore } from '@lanshu/im';
import { generateRoute, generateStore } from '@lanshu/utils';
import App from './App';
import { LsConfirm } from '@lanshu/components';

import 'element-ui/packages/theme-chalk/src/index.scss';
import './assets/styles/index.scss';

Vue.config.productionTip = false;
Vue.config.unwrapInjectedRef = true;

Vue.use(ElementUI);
Vue.use(LsConfirm);
window.ClientMessage = Message;
const Layout = (config = {}) => {
  return new Promise(async (resolve, reject) => {
    const { menu, routes, plugin, platform, store } = config;
    if (!platform) {
      return reject('请设置 platform 值');
    }
    if (menu) {
      localStorage.setItem('menu', JSON.stringify(menu));
    } else {
      localStorage.removeItem('menu');
    }

    if (plugin && platform !== 'personal') {
      localStorage.setItem('hasPlugin', 'true');
      Vue.component('plugin', plugin);
    } else {
      localStorage.removeItem('hasPlugin');
    }

    const completeRoutes = [...baseRoutes];
    if (routes) {
      completeRoutes.push(...routes);
    }

    let completeStore = { IMStore };
    if (store) {
      completeStore = {
        ...completeStore,
        ...store,
      };
    }

    window.$lanshuStore = localforage.createInstance({
      name: 'lanshuStore',
    });

    return resolve(
      new Vue({
        render: (h) => h(App),
        router: generateRoute(Vue, completeRoutes),
        store: generateStore(Vue, completeStore),
      }).$mount('#lanshu-app'),
    );
  });
};

export default Layout;
