import { Layout } from '@lanshu/layout';
import routes from '@/router';
import plugin from './components/plugin';

Layout({
  menu: [{ label: '哈哈', path: '/view2' }],
  routes,
  plugin,
  // personal,government
  // platform: 'personal',
  platform: 'government',
}).catch((error) => {
  console.error(error);
});
