import { Layout } from '@lanshu/layout';
import routes, { menuRoutes } from '@/router';
import plugin from './components/plugin';

const isDevelopment = process.env.NODE_ENV === 'development';

console.log(__dirname, process.cwd());

window.webviewPreload = `file://${
  isDevelopment
    ? `${process.cwd()}\\src\\views\\webview\\preload.js`
    : `${__dirname}\\preload.js`
}`;

Layout({
  menu: menuRoutes,
  routes,
  plugin,
}).catch((error) => {
  console.error(error);
});
