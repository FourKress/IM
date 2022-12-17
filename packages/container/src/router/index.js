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
  {
    name: 'Settings',
    path: '/settings',
    component: () => import('../views/settings/index'),
  },
];

export default baseRoutes;
