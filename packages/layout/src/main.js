import Vue from 'vue';
import { router } from '@lanshu/container';
import App from './App';

Vue.config.productionTip = false;

const Layout = () => {
  return new Vue({
    render: (h) => h(App),
    router,
  }).$mount('#app');
};

export default Layout;
