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
import { PluginAppNav } from '@lanshu/plugin';

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
    window.$lanshuStore = localforage.createInstance({
      name: 'lanshuStore',
    });
    window.$localStore = localforage.createInstance({
      name: 'localStore',
    });
    window.$sessionStore = localforage.createInstance({
      name: 'sessionStore',
    });
    await $sessionStore.clear();

    const { menu, routes, plugins = [], store } = config;
    if (menu) {
      await window.$localStore.setItem('menu', menu);
    } else {
      await window.$localStore.removeItem('menu');
    }

    const completePlugins = [
      {
        visible: false,
        alwaysShow: true,
        component: PluginAppNav,
      },
      ...plugins,
    ];
    if (completePlugins?.length > 1) {
      await window.$localStore.setItem(
        'plugins',
        completePlugins.map((d) => {
          const { component, ...other } = d;
          return {
            ...other,
            key: component.name,
          };
        }),
      );
      completePlugins.forEach((d) => {
        const { component } = d;
        if (!component) return;
        Vue.component(component.name, component);
      });
    } else {
      await window.$localStore.removeItem('plugins');
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
