const state = {
  userInfo: {},
  // 会话列表
  sessionList: [],
  // 主会话窗口
  mainSessionWindow: {},
  // 其余会话窗口
  sessionWindowList: [],
  IM_Network_Status: '',
  IM_DataSync_Status: '',
  SDK_READ: 1,
  currentMsg: {},
  allUnreadCount: 0,
};

const getters = {
  userInfo: (state) => state.userInfo,
  sessionList: (state) => state.sessionList,
  mainSessionWindow: (state) => state.mainSessionWindow,
  sessionWindowList: (state) => state.sessionWindowList,
  IM_Network_Status: (state) => state.IM_Network_Status,
  IM_DataSync_Status: (state) => state.IM_DataSync_Status,
  SDK_NOT_READ: (state) => state.SDK_NOT_READ,
  currentMsg: (state) => state.currentMsg,
  allUnreadCount: (state) => state.allUnreadCount,
};

const mutations = {
  setUserInfo(data, value) {
    data.userInfo = value;
  },
  setAllSession(data, value) {
    console.log('!!!', value);
    data.sessionList = value.map((d) => {
      const { lastMsg = null } = d;
      return {
        ...d,
        lastMsg: lastMsg || {},
      };
    });
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
  setIMNetworkStatus(data, value) {
    data.IM_Network_Status = value;
  },
  setIMDataSyncStatus(data, value) {
    data.IM_DataSync_Status = value;
  },
  setCurrentMsg(data, value) {
    data.currentMsg = value;
  },
  setAllUnreadCount(data, value) {
    data.allUnreadCount = value;
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
  setIMNetworkStatus({ commit }, value) {
    commit('setIMNetworkStatus', value);
  },
  setIMDataSyncStatus({ commit }, value) {
    commit('setIMDataSyncStatus', value);
  },
  setCurrentMsg({ commit }, value) {
    commit('setCurrentMsg', value);
  },
  setAllUnreadCount({ commit }, value) {
    commit('setAllUnreadCount', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
