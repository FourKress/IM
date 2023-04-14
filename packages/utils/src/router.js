import Router from 'vue-router';

import { stareInstance } from './store';
import { checkToken } from './token';

const whitelist = ['Login', 'TRTC'];

/**
 * 路由鉴权
 * 1：是否需要鉴权 white 白名单
 * 2：鉴权 cookie信息是否存在
 * 3：用户信息是否存在
 * 4：鉴权（鉴权依据可动态验证，根据后端返回结果验证是否有权限）
 * */
const routerIntercept = () => {
  return async (to, form, next) => {
    try {
      if (whitelist.includes(to.name)) return next();
      const token = checkToken();
      // const { userInfo } = stareInstance.state.globalStore;
      // if (token && token !== 'undefined' && userInfo) {
      //   return next();
      // }
      if (token) {
        return next();
      }
      return next('/login');
    } catch (e) {
      stareInstance.commit('globalStore/setUserError', {
        visible: true,
        message: e,
      });
      next(false);
    }
  };
};

let routeInstance = null;

const generateRoute = (Vue, routes) => {
  Vue.use(Router);

  const router = new Router({
    routes,
  });

  routeInstance = router;

  router.beforeEach(routerIntercept(routes));

  return router;
};

export { routeInstance };

export default generateRoute;
