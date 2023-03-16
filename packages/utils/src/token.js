/**
 * 获取本地Token
 * 更新本地Token
 * 删除本地Token
 */

const authKey = 'authKey';

// 获取本地token
export function getToken() {
  return localStorage.getItem(authKey);
}

// 设置/更新本地token
export function setToken(data) {
  const { token } = data;
  return localStorage.setItem(authKey, token);
}

// 移除本地token
export function removeToken(key = authKey) {
  localStorage.removeItem(authKey);
}

/**
 * 检查本地token状态
 * @returns {number} status: 0 = 不存在/过期，1 = 正常，2 = 更新;
 * @returns {string} refresh_token: status = 2时会返回;
 * }
 */
export function checkToken() {
  return getToken();
}
