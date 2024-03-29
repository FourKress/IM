export const IMSDKMainProvide = {
  provider: 'getMainProvider',
  events: {
    login: 'login',
    logout: 'logout',
  },
};

export const IMSDKUserProvider = {
  provider: 'getUserProvider',
  events: {
    getUserAttribute: 'getUserAttrbute',
    getUserProfile: 'getUserProfile',
    setUserProfile: 'setUserProfile',
    searchUserProfileOfPhone: 'searchUserProfileOfPhone',
  },
};

export const IMSDKConvProvider = {
  provider: 'getConvProvider',
  events: {
    getConvList: 'getConvList',
    getTotalUnreadMessageCount: 'getTotalUnreadMessageCount',
    clearUnreadCount: 'clearUnreadCount',
    getByUserId: 'getByUserId',
    getBySessId: 'getBySessId',
    setTopBySessId: 'setTopBySessId',
    delBySessId: 'delBySessId',
    setHelpConvBySessId: 'setHelpConvBySessId',
  },
};

export const IMSDKMessageProvider = {
  provider: 'getMessageProvider',
  events: {
    getMessageList: 'getMessageList',
    sendMessage: 'sendMessage',
    createTextMessage: 'createTextMessage',
    createImgMessage: 'createImgMessage',
    createVideoMessage: 'createVideoMessage',
    createVoiceMessage: 'createVoiceMessage',
    createFileMessage: 'createFileMessage',
    createCustomMessage: 'createCustomMessage',
    clearMessage: 'clearMessage',
    searchMessageOfText: 'searchMessageOfText',
    searchMessageByMsgType: 'searchMessageByMsgType',
    revokeMessage: 'revokeMessage',
    createTextAtMessage: 'createTextAtMessage',
    receiptMessage: 'receiptMessage',
  },
};

export const IMSDKGroupProvider = {
  provider: 'getGroupProvider',
  events: {
    createGroup: 'createGroup',
    getGroupMemberList: 'getGroupMemberList',
    inviteMember: 'inviteMember',
    getGroupList: 'getGroupList',
    getGroupAttribute: 'getGroupAttribute',
    setGroupAttribute: 'setGroupAttribute',
    setGroupAlias: 'setGroupAlias',
    getGroupMemberInfo: 'getGroupMemberInfo',
    getMyGroupMemberInfo: 'getMyGroupMemberInfo',
    adminDelGroupMembers: 'adminDelGroupMembers',
    getGroupRoleManagerList: 'getGroupRoleManagerList',
    setGroupRoleManagerList: 'setGroupRoleManagerList',
    ownerTransfer: 'ownerTransfer',
    exitGroupChat: 'exitGroupChat',
    dissolveGroupChat: 'dissolveGroupChat',
    setGroupMemberAddType: 'setGroupMemberAddType',
    setGroupMemberAdminRole: 'setGroupMemberAdminRole',
    getAllAdminList: 'getAllAdminList',
    setGroupRemark: 'setGroupRemark',
    getGroupCurrentMemberCount: 'getGroupCurrentMemberCount',
  },
};

export const IMSDKFileProvider = {
  provider: 'getFileProvider',
  events: {
    uploadFile: 'uploadFile',
  },
};

export const IMSDKNetworkPhoneProvider = {
  provider: 'getNetworkPhoneProvider',
  events: {
    startNetworkCall: 'startNetworkCall',
    stopNetworkCall: 'stopNetworkCall',
    answerNetworkCall: 'answerNetworkCall',
  },
};

export const IMSDKFriendProvider = {
  provider: 'getFriendProvider',
  events: {
    getAllFriendList: 'getAllFriendList',
    getOneFriend: 'getOneFriend',
    friendAddRequest: 'friendAddRequest',
    agreeFriendAddRequest: 'agreeFriendAddRequest',
    delFriendOneWay: 'delFriendOneWay',
    searchFriends: 'searchFriends',
    queryFriendRequestNotice: 'queryFriendRequestNotice',
    getFriendRequestNoticeUnreadCount: 'getFriendRequestNoticeUnreadCount',
    clearFriendRequestNoticeUnreadCount: 'clearFriendRequestNoticeUnreadCount',
    setRemarkOrDesc: 'setRemarkOrDesc',
  },
};
