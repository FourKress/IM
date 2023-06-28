import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';

Layout({
  menu: menuRoutes,
  routes,
}).catch((error) => {
  console.error(error);
});
