const state = {
  userInfo: {},
  // 会话列表
  sessionList: [],
  // 主会话窗口
  mainSessionWindow: {},
  // 其余会话窗口
  sessionWindowList: [],
};

const getters = {
  userInfo: (state) => state.userInfo,
  sessionList: (state) => state.sessionList,
  mainSessionWindow: (state) => state.mainSessionWindow,
  sessionWindowList: (state) => state.sessionWindowList,
};

const mutations = {
  setUserInfo(data, value) {
    data.userInfo = value;
  },
  setAllSession(data, value) {
    data.sessionList = value;
  },
  setMainSessionWindow(data, value) {
    data.mainSessionWindow = value;
  },
  addSessionWindowList(data, value) {
    if (data.sessionWindowList.some((d) => d.sessId === value.sessId)) return;
    data.sessionWindowList.push(value);
  },
  removeSessionWindowList(data, value) {
    const sessionWindowList = data.sessionWindowList.filter(
      (d) => d.sessId !== value.sessId,
    );
    data.sessionWindowList = sessionWindowList;
  },
};

const actions = {
  setUserInfo({ commit }, value) {
    commit('setUserInfo', value);
  },
  setAllSession({ commit }, value) {
    commit('setAllSession', value);
  },
  setMainSessionWindow({ commit }, value) {
    commit('setMainSessionWindow', value);
  },
  addSessionWindowList({ commit }, value) {
    commit('addSessionWindowList', value);
  },
  removeSessionWindowList({ commit }, value) {
    commit('removeSessionWindowList', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
