import Vuex from 'vuex';

import globalStore from './modules/global.js';
import routerStore from './modules/router.js';
import microStore from './modules/micro';

let stareInstance = null;

const generateStore = (Vue, stores) => {
  Vue.use(Vuex);

  const store = new Vuex.Store({
    modules: {
      globalStore,
      routerStore,
      microStore,
      ...stores,
    },
  });

  stareInstance = store;

  return store;
};

export { stareInstance };

export default generateStore;
