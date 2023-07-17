const state = {
  // 用户基本信息
  userInfo: {},
  // 用户资料
  userProfile: {},
  // 会话列表
  sessionList: [],
  // 主会话窗口
  mainSessionWindow: {},
  // 协同会话窗口
  synergySessionList: [],
  // 协同会话状态
  synergyStatus: false,
  // 网络状态
  IM_Network_Status: 0,
  // 数据同步状态
  IM_DataSync_Status: null,
  // 当前消息
  currentMsg: {},
  // 总未读数
  allUnreadCount: 0,
  // 刷新聊天Msg
  refreshMsg: '',
  // 当前操作的SessionWindow
  actionWindow: {},
  // 刷新群成员
  refreshMembers: '',
  // 文件拖拽列表
  dragFileList: [],
  // 新好友申请数
  newFriendCount: 0,
  // 刷新联系人列表
  refreshAddressBook: '',
  // 刷新群权限信息
  refreshGroupRoleManager: '',
  // 头像或昵称修改通知
  userNicknameAvatarUpdate: '',
  // 群成员在群内的昵称修改通知
  groupUserAttributeChanged: '',
  // 被提出或退出群聊
  groupMemberDeleteCallBack: '',
  // 协同历史
  synergyHistory: JSON.parse(localStorage.getItem('synergyHistory') || '[]'),
};

const getters = {
  userInfo: (state) => state.userInfo,
  userProfile: (state) => state.userProfile,
  sessionList: (state) => state.sessionList,
  mainSessionWindow: (state) => state.mainSessionWindow,
  synergySessionList: (state) => state.synergySessionList,
  synergyStatus: (state) => state.synergyStatus,
  IM_Network_Status: (state) => state.IM_Network_Status,
  IM_DataSync_Status: (state) => state.IM_DataSync_Status,
  currentMsg: (state) => state.currentMsg,
  allUnreadCount: (state) => state.allUnreadCount,
  refreshMsg: (state) => state.refreshMsg,
  actionWindow: (state) => state.actionWindow,
  refreshMembers: (state) => state.refreshMembers,
  dragFileList: (state) => state.dragFileList,
  newFriendCount: (state) => state.newFriendCount,
  refreshAddressBook: (state) => state.refreshAddressBook,
  refreshGroupRoleManager: (state) => state.refreshGroupRoleManager,
  userNicknameAvatarUpdate: (state) => state.userNicknameAvatarUpdate,
  groupUserAttributeChanged: (state) => state.groupUserAttributeChanged,
  groupMemberDeleteCallBack: (state) => state.groupMemberDeleteCallBack,
  synergyHistory: (state) => state.synergyHistory,
};

const mutations = {
  setUserInfo(data, value) {
    data.userInfo = value;
  },
  setUserProfile(data, value) {
    data.userProfile = value;
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
  setSynergySessionList(data, value) {
    data.synergySessionList = value;
  },
  setSynergyStatus(data, value) {
    data.synergyStatus = value;
    if (!value) {
      data.synergySessionList = [];
    }
  },
  addSynergySessionList(data, value) {
    const realList = value.filter((n) =>
      data.synergySessionList.every((d) => d.sessId !== n.sessId),
    );
    data.synergySessionList.push(...realList);
  },
  removeSynergySessionList(data, value) {
    const synergySessionList = data.synergySessionList.filter(
      (d) => d.sessId !== value.sessId,
    );
    data.synergySessionList = synergySessionList;
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
  setRefreshAddressBook(data, value) {
    data.refreshAddressBook = value;
  },
  setRefreshGroupRoleManager(data, value) {
    data.refreshGroupRoleManager = value;
  },
  setUserNicknameAvatarUpdate(data, value) {
    data.userNicknameAvatarUpdate = value;
  },
  setGroupUserAttributeChanged(data, value) {
    data.groupUserAttributeChanged = value;
  },
  setGroupMemberDeleteCallBack(data, value) {
    data.groupMemberDeleteCallBack = value;
  },
  setSynergyHistory(data, historySynergyIds) {
    let historyList = [];
    const { synergyHistory = [] } = data;
    const currentHistory = [...synergyHistory];

    historySynergyIds.forEach((h) => {
      const rawData = historyList.length ? historyList : currentHistory;
      const hasHistory = currentHistory.some((d) => d === h);
      if (hasHistory) {
        const temp = rawData.filter((d) => d !== h);
        historyList = [h, ...temp];
      } else {
        historyList = [h, ...rawData];
      }
    });

    const resultHistory =
      historyList.length > 6 ? historyList.slice(0, 6) : historyList;
    data.synergyHistory = resultHistory;
    localStorage.setItem('synergyHistory', JSON.stringify(resultHistory));
  },
};

const actions = {
  setUserInfo({ commit }, value) {
    commit('setUserInfo', value);
  },
  setUserProfile({ commit }, value) {
    commit('setUserProfile', value);
  },
  setAllSession({ commit }, value) {
    commit('setAllSession', value);
  },
  setMainSessionWindow({ commit }, value) {
    commit('setMainSessionWindow', value);
  },
  setSynergySessionList({ commit }, value) {
    commit('setSynergySessionList', value);
  },
  setSynergyStatus({ commit }, value) {
    commit('setSynergyStatus', value);
  },
  addSynergySessionList({ commit }, value) {
    commit('addSynergySessionList', value);
  },
  removeSynergySessionList({ commit }, value) {
    commit('removeSynergySessionList', value);
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
  setRefreshAddressBook({ commit }, value) {
    commit('setRefreshAddressBook', value);
  },
  setRefreshGroupRoleManager({ commit }, value) {
    commit('setRefreshGroupRoleManager', value);
  },
  setUserNicknameAvatarUpdate({ commit }, value) {
    commit('setUserNicknameAvatarUpdate', value);
  },
  setGroupUserAttributeChanged({ commit }, value) {
    commit('setGroupUserAttributeChanged', value);
  },
  setGroupMemberDeleteCallBack({ commit }, value) {
    commit('setGroupMemberDeleteCallBack', value);
  },
  setSynergyHistory({ commit }, value) {
    console.log('commit', value);
    commit('setSynergyHistory', value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
