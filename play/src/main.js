import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';
import PluginAppNav from './components/plugin-app/nav.vue';
import plugin from './components/plugin.vue';
import pluginB from './components/plugin-b.vue';

Layout({
  menu: menuRoutes,
  routes,
  plugins: [
    {
      visible: true,
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
}).catch((error) => {
  console.error(error);
});
