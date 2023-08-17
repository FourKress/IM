import Vue from 'vue';
import localforage from 'localforage';
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { baseRoutes } from '@lanshu/container';
import { IMStore, SynergyView } from '@lanshu/im';
import {
  generateRoute,
  generateStore,
  VuePrototype,
  VueDirective,
} from '@lanshu/utils';
import App from './App';
import { LsConfirm, LsContextMenu } from '@lanshu/components';

import 'element-ui/packages/theme-chalk/src/index.scss';
import './assets/styles/index.scss';

Vue.config.productionTip = false;
Vue.config.unwrapInjectedRef = true;

Vue.use(ElementUI);
Vue.use(LsConfirm);
Vue.use(LsContextMenu);
Vue.use(VuePrototype);
Vue.use(VueDirective);

Vue.component(SynergyView.name, SynergyView);

window.ClientMessage = Message;

const Layout = (config = {}) => {
  return new Promise(async (resolve) => {
    const { menu, routes, plugins = [], store } = config;
    if (menu) {
      localStorage.setItem('menu', JSON.stringify(menu));
    } else {
      localStorage.removeItem('menu');
    }

    if (plugins?.length) {
      localStorage.setItem(
        'plugins',
        JSON.stringify(
          plugins.map((d) => {
            return {
              key: d.name,
              visible: false,
            };
          }),
        ),
      );
      plugins.forEach((d) => {
        Vue.component(d.name, d);
      });
    } else {
      localStorage.removeItem('plugins');
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

    // 禁止浏览器的前进后退
    history.pushState = () => {};
    history.back = () => {};

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
