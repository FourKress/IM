import { REST_STORE_STATE } from '../../constant';
import { handleResetStoreState } from '../utils';

const getDefaultState = () => {
  return {
    systemUserInfo: {},
    userErrorMsg: '',
    codeCountdown: 0,
    updateInfo: {},
    startDownload: false,
    updateNotify: false,
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
    openMicroApp: '',
  };
};
const state = getDefaultState();

const getters = {
  systemUserInfo: (state) => state.systemUserInfo,
  userErrorMsg: (state) => state.userErrorMsg,
  codeCountdown: (state) => state.codeCountdown,
  updateInfo: (state) => state.updateInfo,
  startDownload: (state) => state.startDownload,
  updateNotify: (state) => state.updateNotify,
  searchHistory: (state) => state.searchHistory,
  openMicroApp: (state) => state.openMicroApp,
};

const mutations = {
  [REST_STORE_STATE](data) {
    data = handleResetStoreState(data, getDefaultState());
  },
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
  setUpdateInfo(data, value) {
    data.updateInfo = value;
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
  setOpenMicroApp(data, value) {
    data.openMicroApp = value;
  },
};

const actions = {
  [REST_STORE_STATE]({ commit }) {
    commit(REST_STORE_STATE);
  },
  setSystemUserInfo({ commit }, value) {
    commit('setSystemUserInfo', value);
  },
  setUserErrorMsg({ commit }, value) {
    commit('setUserErrorMsg', value);
  },
  setCodeCountdown({ commit }, value) {
    commit('setCodeCountdown', value);
  },
  setUpdateInfo({ commit }, value) {
    commit('setUpdateInfo', value);
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
  setOpenMicroApp({ commit }, value) {
    commit('setOpenMicroApp', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
