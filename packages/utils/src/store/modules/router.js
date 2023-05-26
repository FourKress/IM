const state = {
  breadCrumbs: [],
  historyMainPath: '',
  orgBreadCrumbs: [{ label: '测试' }, { label: '测试1' }, { label: '测试222' }],
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
    const flag = data.orgBreadCrumbs.some((d) => d.path === value.path);
    if (flag) return;
    data.orgBreadCrumbs.push(value);
  },
  deleteOrgBreadCrumb(data, value) {
    data.orgBreadCrumbs = data.orgBreadCrumbs.filter(
      (d) => d.path !== value.path,
    );
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
