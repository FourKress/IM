const state = {
  microLoadStatus: false,
  microLoadPool: [],
  microSharedState: {},
};

const getters = {
  microLoadStatus: (state) => state.microLoadStatus,
  microLoadPool: (state) => state.microLoadPool,
  microSharedState: (state) => state.microSharedState,
};

const mutations = {
  setMicroLoadStatus(data, value) {
    data.microLoadStatus = value;
  },
  setMicroLoadPool(data, value) {
    data.microLoadPool.push(value);
  },
  setMicroSharedState(data, value) {
    data.microSharedState = value;
  },
};

const actions = {
  setMicroLoadStatus({ commit }, value) {
    commit('setMicroLoadStatus', value);
  },
  setMicroLoadPool({ commit }, value) {
    commit('setMicroLoadPool', value);
  },
  setMicroSharedState({ commit }, value) {
    commit('setMicroSharedState', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
