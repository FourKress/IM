const baseRoutes = [
  {
    name: 'MainView',
    path: '/',
    component: () => import('../views/main-view/index'),
  },
];

export default baseRoutes;
