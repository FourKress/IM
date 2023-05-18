import { mergePathMark, MICRO_CONTAINER, storeInstance } from '@lanshu/utils';

const container = `#${MICRO_CONTAINER}`;

class Mirco {
  getConfigs = () => {
    const appList =
      storeInstance.getters['globalStore/systemUserInfo']?.appList || [];
    console.log(appList);

    return appList.map((d) => {
      /**
       * name: 微应用名称 - 具有唯一性
       * entry: 微应用入口 - 通过该地址加载微应用
       * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
       * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
       */
      return {
        name: mergePathMark(d.appCode),
        entry: '//localhost:5000/',
        container,
      };
    });
  };
  getRoutes() {
    const appList =
      storeInstance.getters['globalStore/systemUserInfo']?.appList || [];
    console.log(appList);

    const routers = appList.map((d) => {
      const key = mergePathMark(d.appCode);
      return {
        name: key,
        path: `/${key}`,
        meta: {
          isMenu: true,
          name: d.appName,
          disableIcon: d.icon,
          activeIcon: d.icon,
        },
      };
    });

    console.log(routers);
    // TODO 暂时屏蔽
    return [];
    // return routers;
  }
}

export default new Mirco();
