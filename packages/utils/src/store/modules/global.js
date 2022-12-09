const state = {
  userInfo: {},
  userError: {
    visible: false,
    message: '',
    type: '',
  },
};

const getters = {
  userInfo: (state) => state.userInfo,
  userError: (state) => state.userError,
};

const mutations = {
  setUserInfo(data, value) {
    data.userInfo = value;
  },
  setUserError(data, value) {
    data.userError = value;
  },
};

const actions = {
  setUserInfo({ commit }, value) {
    commit('setUserInfo', value);
  },
  setUserError({ commit }, value) {
    commit('setUserError', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
