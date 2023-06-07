import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';
import plugin from './components/plugin';

Layout({
  menu: menuRoutes,
  routes,
  plugin,
}).catch((error) => {
  console.error(error);
});
