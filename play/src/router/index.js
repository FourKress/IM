const routes = [
  {
    name: 'PublicSentiment',
    path: '/publicSentiment',
    component: () => import('../views/webview/index'),
    meta: {
      isMenu: true,
      name: '舆情',
      disableIcon: 'ls-icon-icon_yuqing_normal',
      activeIcon: 'ls-icon-icon_yuqing_selected',
      webviewSrc: 'http://www.netinsight.com.cn/',
      preloadConfig: {
        userEl: '#inputEmail',
        userName: 'ycqxcbuser',
        passwordEl: '#inputPassword',
        password: 'trs@300229',
        rememberEl: '.mySame input',
        loginBtnEl: '.buttonCim button',
        awaitTime: 2000,
      },
    },
  },
  {
    name: 'Industry',
    path: '/industry',
    component: () => import('../views/webview/index'),
    meta: {
      isMenu: true,
      name: '产业',
      disableIcon: 'ls-icon-icon_chanye_normal',
      activeIcon: 'ls-icon-icon_chanye_selected',
      webviewSrc: 'https://ib.dataelite.trs.com.cn/home-page/index?',
      preloadConfig: {
        userEl: '.password-input input[type="text"]',
        userName: 'tianxing82@outlook.com',
        passwordEl: '.password-input input[type="password"]',
        password: 'Ovv_SYb9Fq',
        rememberEl: '.remember-password .el-checkbox__inner',
        agreementEl: '.service-agreement .el-checkbox__inner',
        loginBtnEl: '.pwd-login button',
        awaitTime: 2000,
      },
    },
  },
  {
    name: 'Policy',
    path: '/policy',
    component: () => import('../views/webview/index'),
    meta: {
      isMenu: true,
      name: '政策',
      disableIcon: 'ls-icon-icon_zhengche_normal',
      activeIcon: 'ls-icon-icon_zhengche_selected',
      webviewSrc: 'https://zck:L6mLkop*vjrJ@hycloud.trscd.com.cn/zc-service/#/',
      isNavPage: true,
      preloadConfig: {
        awaitTime: 500,
      },
    },
  },
];

export const menuRoutes = routes.map((route) => {
  const { name, path, meta } = route;
  return {
    name,
    path,
    meta,
  };
});
export default routes;
