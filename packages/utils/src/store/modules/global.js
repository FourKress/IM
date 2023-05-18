const state = {
  systemUserInfo: {},
  userErrorMsg: '',
  codeCountdown: 0,
  updateVersion: '',
  startDownload: false,
  updateNotify: JSON.parse(localStorage.getItem('updateNotify') || 'false'),
  searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
};

const getters = {
  systemUserInfo: (state) => state.systemUserInfo,
  userErrorMsg: (state) => state.userErrorMsg,
  codeCountdown: (state) => state.codeCountdown,
  updateVersion: (state) => state.updateVersion,
  startDownload: (state) => state.startDownload,
  updateNotify: (state) => state.updateNotify,
  searchHistory: (state) => state.searchHistory,
};

const mutations = {
  setSystemUserInfo(data, value) {
    data.systemUserInfo = value;
  },
  setUserErrorMsg(data, value) {
    data.userErrorMsg = value;
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
    sessionStorage.setItem('updateNotify', value);
  },
  setSearchHistory(data, value) {
    data.searchHistory = value;
    localStorage.setItem('searchHistory', JSON.stringify(value));
  },
};

const actions = {
  setSystemUserInfo({ commit }, value) {
    commit('setSystemUserInfo', value);
  },
  setUserErrorMsg({ commit }, value) {
    commit('setUserErrorMsg', value);
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
  setSearchHistory({ commit }, value) {
    commit('setSearchHistory', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
