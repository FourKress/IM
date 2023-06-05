const state = {
  breadCrumbs: [],
  historyMainPath: '',
  orgBreadCrumbs: [],
};

const getters = {
  breadCrumbs: (state) => state.breadCrumbs,
  historyMainPath: () => state.historyMainPath,
  orgBreadCrumbs: () => state.orgBreadCrumbs,
};

const mutations = {
  addBreadCrumb(data, value) {
    const flag = data.breadCrumbs.some((d) => d.path === value.path);
    if (flag) return;
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
  addOrgBreadCrumb(data, value) {
    const flag = data.orgBreadCrumbs.some((d) => d.key === value.key);
    if (flag) return;
    data.orgBreadCrumbs.push(value);
  },
  deleteOrgBreadCrumb(data, index) {
    console.log(index);
    data.orgBreadCrumbs = data.orgBreadCrumbs.splice(0, index + 1);
  },
  setOrgBreadCrumb(data, value) {
    data.orgBreadCrumbs = value;
  },
  clearOrgBreadCrumb(data) {
    data.orgBreadCrumbs = [];
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
  addOrgBreadCrumb({ commit }, value) {
    commit('addOrgBreadCrumb', value);
  },
  setOrgBreadCrumb({ commit }, value) {
    commit('setOrgBreadCrumb', value);
  },
  deleteOrgBreadCrumb({ commit }, value) {
    commit('deleteOrgBreadCrumb', value);
  },
  clearOrgBreadCrumb({ commit }) {
    commit('clearOrgBreadCrumb');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
