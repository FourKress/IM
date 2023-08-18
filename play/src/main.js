import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';
import PluginAppNav from './components/plugin-app/nav.vue';
import plugin from './components/plugin.vue';
import pluginB from './components/plugin-b.vue';

Layout({
  menu: menuRoutes,
  routes,
  plugins: [PluginAppNav, plugin, pluginB],
}).catch((error) => {
  console.error(error);
});
