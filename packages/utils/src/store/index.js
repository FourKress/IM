import Vuex from 'vuex';
import { microVuexStore, MicroVuexStoreModule } from '@lanshu/micro';
import globalStore from './modules/global.js';
import routerStore from './modules/router.js';

let storeInstance = null;

const generateStore = (Vue, stores) => {
  Vue.use(Vuex);

  const store = new Vuex.Store({
    modules: {
      globalStore,
      routerStore,
      microVuexStore,
      ...stores,
    },
  });

  storeInstance = store;
  // 把store实例注册到微应用依赖
  MicroVuexStoreModule.setStore(storeInstance);

  return store;
};

export { storeInstance };

export default generateStore;
