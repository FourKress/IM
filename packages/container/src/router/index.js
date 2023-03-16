import { TrtcView } from '@lanshu/im';

const baseRoutes = [
  {
    name: 'MainView',
    path: '/',
    component: () => import('../views/main-view/index'),
    meta: {
      isMenu: true,
      name: '消息',
      disableIcon: 'menu_xx_nor',
      activeIcon: 'menu_xx_sel',
    },
  },
  {
    name: 'AddressBook',
    path: '/addressBook',
    component: () => import('../views/addressBook/index'),
    meta: {
      isMenu: true,
      name: '通讯录',
      disableIcon: 'menu_txl_nor',
      activeIcon: 'menu_txl_sel',
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/login/index'),
    meta: {
      isFull: true,
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
  {
    name: 'TRTC',
    path: '/TRTC',
    component: TrtcView,
    meta: {
      isFull: true,
    },
  },
];

export default baseRoutes;
