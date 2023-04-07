const state = {
  userInfo: {},
  // 会话列表
  sessionList: [],
  // 主会话窗口
  mainSessionWindow: {},
  // 其余会话窗口
  sessionWindowList: [],
  // 网络状态
  IM_Network_Status: 0,
  // 数据同步状态
  IM_DataSync_Status: null,
  // SDK准备完成标识
  SDK_READ: 1,
  // 当前消息
  currentMsg: {},
  // 总未读数
  allUnreadCount: 0,
  // 刷新聊天Msg
  refreshMsg: false,
  // 当前操作的SessionWindow
  actionWindow: {},
  // 刷新群成员
  refreshMembers: '',
  dragFileList: [],
  newFriendCount: 0,
};

const getters = {
  userInfo: (state) => state.userInfo,
  sessionList: (state) => state.sessionList,
  mainSessionWindow: (state) => state.mainSessionWindow,
  sessionWindowList: (state) => state.sessionWindowList,
  IM_Network_Status: (state) => state.IM_Network_Status,
  IM_DataSync_Status: (state) => state.IM_DataSync_Status,
  SDK_READ: (state) => state.SDK_READ,
  currentMsg: (state) => state.currentMsg,
  allUnreadCount: (state) => state.allUnreadCount,
  refreshMsg: (state) => state.refreshMsg,
  actionWindow: (state) => state.actionWindow,
  refreshMembers: (state) => state.refreshMembers,
  dragFileList: (state) => state.dragFileList,
  newFriendCount: (state) => state.newFriendCount,
};

const mutations = {
  setUserInfo(data, value) {
    data.userInfo = value;
  },
  setAllSession(data, value) {
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
  setRefreshMsg(data, value) {
    data.refreshMsg = value;
  },
  setActionWindow(data, value) {
    data.actionWindow = value;
  },
  setRefreshMembers(data, value) {
    data.refreshMembers = value;
  },
  setDragFileList(data, value) {
    data.dragFileList = value;
  },
  setNewFriendCount(data, value) {
    data.newFriendCount = value;
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
  setRefreshMsg({ commit }, value) {
    commit('setRefreshMsg', value);
  },
  setActionWindow({ commit }, value) {
    commit('setActionWindow', value);
  },
  setRefreshMembers({ commit }, value) {
    commit('setRefreshMembers', value);
  },
  setDragFileList({ commit }, value) {
    commit('setDragFileList', value);
  },
  setNewFriendCount({ commit }, value) {
    commit('setNewFriendCount', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
