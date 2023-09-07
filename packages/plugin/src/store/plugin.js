import { REST_STORE_STATE, resetStoreState } from '@lanshu/utils';

const getDefaultState = () => {
  return {
    activeMicroApp: '',
  };
};
const state = getDefaultState();

const getters = {
  activeMicroApp: (state) => state.activeMicroApp,
};

const mutations = {
  [REST_STORE_STATE](data) {
    // eslint-disable-next-line no-unused-vars
    data = resetStoreState(data, getDefaultState());
  },
  setActiveMicroApp(data, value) {
    data.activeMicroApp = value;
  },
};

const actions = {
  [REST_STORE_STATE]({ commit }) {
    commit(REST_STORE_STATE);
  },
  setActiveMicroApp({ commit }, value) {
    commit('setActiveMicroApp', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
