import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';

import plugin from './components/plugin.vue';

Layout({
  menu: menuRoutes,
  routes,
  plugins: [
    {
      visible: false,
      component: plugin,
    },
  ],
}).catch((error) => {
  console.error(error);
});
