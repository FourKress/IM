import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { baseRoutes } from '@lanshu/container';
import { IMStore } from '@lanshu/im';
import { generateRoute, generateStore } from '@lanshu/utils';
import App from './App';

import './assets/styles/index.scss';

Vue.config.productionTip = false;

Vue.use(ElementUI);

const Layout = (config = {}) => {
  return new Promise((resolve, reject) => {
    const { menu, routes, plugin, platform, store } = config;
    if (!platform) {
      return reject('请设置 platform 值');
    }
    if (menu) {
      localStorage.setItem('menu', JSON.stringify(menu));
    }

    if (plugin && platform !== 'personal') {
      localStorage.setItem('hasPlugin', 'true');
      Vue.component('plugin', plugin);
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

    return resolve(
      new Vue({
        render: (h) => h(App),
        router: generateRoute(Vue, completeRoutes),
        store: generateStore(Vue, completeStore),
      }).$mount('#app'),
    );
  });
};

export default Layout;
