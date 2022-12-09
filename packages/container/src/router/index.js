const baseRoutes = [
  {
    name: 'MainView',
    path: '/',
    component: () => import('../views/main-view/index'),
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/login/index'),
    meta: {
      isLogin: true,
    },
  },
];

export default baseRoutes;
