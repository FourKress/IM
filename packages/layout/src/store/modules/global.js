const state = {
  // 全屏遮罩
  fullScreenLoading: false,
  // 菜单展开收起状态控制
};

const getters = {
  fullScreenLoading: (state) => state.fullScreenLoading,
};

const mutations = {
  fullScreenLoading(data, value) {
    data.fullScreenLoading = value;
  },
};

const actions = {
  setFullScreenLoading({ commit }, value) {
    commit('fullScreenLoading', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
