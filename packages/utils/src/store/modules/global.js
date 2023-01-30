const state = {
  userInfo: {},
  userError: {
    visible: false,
    message: '',
    type: '',
  },
  codeCountdown: 0,
};

const getters = {
  userInfo: (state) => state.userInfo,
  userError: (state) => state.userError,
  codeCountdown: (state) => state.codeCountdown,
};

const mutations = {
  setUserInfo(data, value) {
    data.userInfo = value;
  },
  setUserError(data, value) {
    data.userError = value;
  },
  setCodeCountdown(data, value) {
    data.codeCountdown = value;
    const timer = setInterval(() => {
      data.codeCountdown--;
      if (data.codeCountdown <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  },
};

const actions = {
  setUserInfo({ commit }, value) {
    commit('setUserInfo', value);
  },
  setUserError({ commit }, value) {
    commit('setUserError', value);
  },
  setCodeCountdown({ commit }, value) {
    commit('setCodeCountdown', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
