import { microKeyMap, mergeMicroAppMark } from '@lanshu/utils';

const microRoutes = [
  {
    key: microKeyMap.System,
    meta: {
      isMenu: true,
      name: '后台',
      disableIcon: 'menu_txl_nor',
      activeIcon: 'menu_txl_sel',
    },
  },
];
export default microRoutes.map((d) => {
  const { key } = d;
  return {
    ...d,
    name: mergeMicroAppMark(key),
    path: mergeMicroAppMark(`/${key}`),
  };
});
