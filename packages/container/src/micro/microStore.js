import { microStore } from '@lanshu/micro';
import { stareInstance } from '@lanshu/utils';

const handleChange = () => {
  const state = microStore.getState();
  console.log(state);
  stareInstance.commit('microStore/setMicroSharedState', state);
};

class MicroStore {
  static _unsubscribe;

  subscribe = () => {
    this._unsubscribe = microStore.subscribe(handleChange);
  };

  unsubscribe = () => {
    this._unsubscribe();
  };
}

export default new MicroStore();
