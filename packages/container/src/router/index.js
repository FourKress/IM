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
    redirect: '/settings/home',
    children: [
      {
        name: 'Home',
        path: 'home',
        component: () => import('../views/settings/home/index'),
      },
      {
        name: 'ChangePhoneNum',
        path: 'changePhoneNum',
        component: () => import('../views/settings/change-phoneNum/index'),
      },
      {
        name: 'Devices',
        path: 'devices',
        component: () => import('../views/settings/devices/index'),
      },
    ],
  },
];

export default baseRoutes;
