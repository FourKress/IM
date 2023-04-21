import { microKeyMap } from '@lanshu/utils';

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
  {
    key: microKeyMap.KnowledgeBase,
    meta: {
      isMenu: true,
      name: '知识库',
      disableIcon: 'menu_txl_nor',
      activeIcon: 'menu_txl_sel',
    },
  },
];
export default microRoutes.map((d) => {
  const { key } = d;
  return {
    ...d,
    name: key,
    path: `/${key}`,
  };
});
1;
