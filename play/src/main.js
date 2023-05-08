import { Layout } from '@lanshu/layout';
import routes from '@/router';
import plugin from './components/plugin';

Layout({
  // menu: [{ label: '哈哈', path: '/view2', icon: 'menu_xx_sel' }],
  routes,
  plugin,
}).catch((error) => {
  console.error(error);
});
