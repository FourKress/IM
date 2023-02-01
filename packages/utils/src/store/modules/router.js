const state = {
  breadCrumbs: [],
  historyMainPath: '',
};

const getters = {
  breadCrumbs: (state) => state.breadCrumbs,
  historyMainPath: () => state.historyMainPath,
};

const mutations = {
  addBreadCrumb(data, value) {
    data.breadCrumbs.push(value);
  },
  deleteBreadCrumb(data, value) {
    data.breadCrumbs = data.breadCrumbs.filter((d) => d.path !== value.path);
  },
  clearBreadCrumb(data) {
    data.breadCrumbs = [];
  },
  setHistoryMainPath(data, value) {
    data.historyMainPath = value;
  },
};

const actions = {
  addBreadCrumbs({ commit }, value) {
    commit('addBreadCrumb', value);
  },
  deleteBreadCrumb({ commit }, value) {
    commit('deleteBreadCrumb', value);
  },
  clearBreadCrumb({ commit }) {
    commit('clearBreadCrumb');
  },
  setHistoryMainPath({ commit }, value) {
    commit('setHistoryMainPath', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
