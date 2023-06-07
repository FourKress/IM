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
      webviewSrc: 'https://hycloud.trscd.com.cn/zc-service/#/PolicyOverview',
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
