const state = {
  userInfo: {},
  userError: {
    visible: false,
    message: '',
    type: '',
  },
  codeCountdown: 0,
  updateVersion: '',
  startDownload: false,
  updateNotify: JSON.parse(localStorage.getItem('updateNotify') || 'false'),
  microLoadStatus: false,
};

const getters = {
  userInfo: (state) => state.userInfo,
  userError: (state) => state.userError,
  codeCountdown: (state) => state.codeCountdown,
  updateVersion: (state) => state.updateVersion,
  startDownload: (state) => state.startDownload,
  updateNotify: (state) => state.updateNotify,
  microLoadStatus: (state) => state.microLoadStatus,
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
        data.codeCountdown = 0;
        clearInterval(timer);
      }
    }, 1000);
  },
  setUpdateVersion(data, value) {
    data.updateVersion = value;
  },
  setStartDownload(data, value) {
    data.startDownload = value;
  },
  setUpdateNotify(data, value) {
    data.updateNotify = value;
    localStorage.setItem('updateNotify', value);
  },
  setMicroLoadStatus(data, value) {
    data.microLoadStatus = value;
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
  setUpdateVersion({ commit }, value) {
    commit('setUpdateVersion', value);
  },
  setStartDownload({ commit }, value) {
    commit('setStartDownload', value);
  },
  setUpdateNotify({ commit }, value) {
    commit('setUpdateNotify', value);
  },
  setMicroLoadStatus({ commit }, value) {
    commit('setMicroLoadStatus', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
