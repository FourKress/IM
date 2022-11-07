import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: 'MainView',
      path: '/',
      component: () => import('../views/main-view/index'),
    },
    {
      name: 'View1',
      path: '/view1',
      component: () => import('../views/view1/index'),
    },
  ],
});

export default router;
