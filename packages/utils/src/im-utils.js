export const _clearSessionUnreadCount = (clearSessId, sessionList = []) => {
  return new Promise(async (resolve, reject) => {
    console.log('清除消息未读数');
    const targetSession = sessionList.find((d) => d.sessId === clearSessId);
    if (targetSession) {
      await IMSDK.clearSessionUnreadCount({ sessId: clearSessId });
    }
  });
};
