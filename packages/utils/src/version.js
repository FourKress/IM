import { renderProcess } from '@lanshu/render-process';
import { storeInstance } from './store';
import { IS_NEVER } from './constant';
import * as Apis from './apis';

// 计算版本号
export const compareVersion = function (version1, version2) {
  const n = version1.length,
    m = version2.length;
  let i = 0,
    j = 0;
  while (i < n || j < m) {
    let x = 0;
    for (; i < n && version1[i] !== '.'; ++i) {
      x = x * 10 + version1[i].charCodeAt() - '0'.charCodeAt();
    }
    ++i; // 跳过点号
    let y = 0;
    for (; j < m && version2.charAt(j) !== '.'; ++j) {
      y = y * 10 + version2[j].charCodeAt() - '0'.charCodeAt();
    }
    ++j; // 跳过点号
    if (x !== y) {
      return x > y ? 1 : -1;
    }
  }
  return 0;
};

// 获取新版本
export const fetchVersion = async (isTips = false) => {
  const currentVersion = await renderProcess.getStore('VERSION');
  if (currentVersion === IS_NEVER) return;

  const res = await Apis.queryLastAvailableByAppCode({
    appCode: 'PC',
  });
  const updateData = res?.data;
  if (!updateData) return;

  const { version, model, decDirectory, title, content } = updateData;

  const isNewVersion = compareVersion(version, currentVersion) === 1;
  if (!isNewVersion) {
    if (isTips) window.ClientMessage.warning('当前已是最新版本');
    return;
  }

  const updateInfo = {
    version,
    isForced: model === 1,
    fetchUrl: decDirectory,
    title,
    content,
  };
  storeInstance.commit('globalStore/setUpdateInfo', updateInfo);

  const UPDATE_NOTIFY = await renderProcess.getStore('UPDATE_NOTIFY');
  if (!updateInfo?.isForced && UPDATE_NOTIFY) {
    storeInstance.commit('globalStore/setUpdateNotify', true);
  }

  return updateInfo;
};
