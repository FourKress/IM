import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';
import { PluginAppNav, pluginStore } from '@lanshu/plugin';

import plugin from './components/plugin.vue';

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
  ],
  store: {
    pluginStore,
  },
}).catch((error) => {
  console.error(error);
});
