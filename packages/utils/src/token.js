/**
 * 获取本地Token
 * 更新本地Token
 * 删除本地Token
 */

// 获取本地token
export async function getToken(authKey) {
  return await window.$sessionStore.getItem(authKey);
}

// 设置/更新本地token
export async function setToken(authKey, token) {
  return await window.$sessionStore.setItem(authKey, token);
}

// 移除本地token
export async function removeToken(authKey) {
  return await window.$sessionStore.removeItem(authKey);
}
