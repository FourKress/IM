import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';
import PluginAppNav from './components/plugin-app/nav.vue';
import plugin from './components/plugin.vue';
import pluginB from './components/plugin-b.vue';
import pluginStore from './store/plugin';

Layout({
  menu: menuRoutes,
  routes,
  plugins: [
    {
      visible: false,
      alwaysShow: true,
      component: PluginAppNav,
    },
    {
      visible: false,
      component: plugin,
    },
    {
      visible: false,
      component: pluginB,
    },
  ],
  store: {
    pluginStore,
  },
}).catch((error) => {
  console.error(error);
});
