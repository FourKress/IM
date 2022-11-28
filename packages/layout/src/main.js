import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex';
import Router from 'vue-router';
import { baseRoutes } from '@lanshu/container';
import global from './store';
import { IMStore } from '@lanshu/im';
import App from './App';

import './assets/styles/theme.scss';

Vue.config.productionTip = false;

Vue.use(ElementUI);

const Layout = (config = {}) => {
  return new Promise((resolve, reject) => {
    const { menu, routes, plugin, platform } = config;
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

    Vue.use(Vuex);
    Vue.use(Router);

    return resolve(
      new Vue({
        render: (h) => h(App),
        router: new Router({
          routes: completeRoutes,
        }),
        store: new Vuex.Store({
          modules: {
            global,
            IMStore,
          },
        }),
      }).$mount('#app'),
    );
  });
};

export default Layout;
