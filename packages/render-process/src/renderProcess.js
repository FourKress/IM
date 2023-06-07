import { WINDOW_TYPE, WIN_ACTION_TYPE } from '@lanshu/utils';
import { storeInstance } from '@lanshu/utils';

const electronAPI = window?.electronAPI ?? {};

export const changeWindow = (type, win) => {
  if (type === WIN_ACTION_TYPE.IS_MAX && win === WINDOW_TYPE.IS_MAIN) {
    const isMaxWindow = storeInstance.getters['globalStore/isMaxWindow'];
    storeInstance.commit('globalStore/setIsMaxWindow', !isMaxWindow);
  }
  electronAPI?.changeWindow(type, win);
};
export const openFileDialog = electronAPI?.openFileDialog;
export const saveFileDialog = electronAPI?.saveFileDialog;
export const startScreenshots = electronAPI?.startScreenshots;
export const showMainWindow = electronAPI?.showMainWindow;
export const showLoginWindow = electronAPI?.showLoginWindow;
export const openUrl = electronAPI?.openUrl;
export const cleanFile = electronAPI?.cleanFile;
export const getFileSize = electronAPI?.getFileSize;
export const setHotKey = electronAPI?.setHotKey;
export const getStore = electronAPI?.getStore;
export const setStore = electronAPI?.setStore;
export const IMSDK_INIT = electronAPI?.IMSDK_INIT;
export const IMSDKIPC = electronAPI?.IMSDKIPC;
export const IMSDKNetworkCall = electronAPI?.IMSDKNetworkCall;
export const IMSDKNetworkCallRefresh = electronAPI?.IMSDKNetworkCallRefresh;
export const IMSDKListener = electronAPI?.IMSDKListener;
export const openTRTCWindow = electronAPI?.openTRTCWindow;
export const TRTCListener = electronAPI?.TRTCListener;
export const hasWindow = electronAPI?.hasWindow;
export const checkForUpdates = electronAPI?.checkForUpdates;
export const mainProcessError = electronAPI?.mainProcessError;
export const setAutoStart = electronAPI?.setAutoStart;
export const downloadProgress = electronAPI?.downloadProgress;
export const activeSearch = electronAPI?.activeSearch;
export const getCacheFilePath = electronAPI?.getCacheFilePath;
export const getCacheFile2Base64 = electronAPI?.getCacheFile2Base64;
export const saveCacheFile = electronAPI?.saveCacheFile;
export const getCacheDirInfo = electronAPI?.getCacheDirInfo;
export const setCacheDir = electronAPI?.setCacheDir;
export const showItemInFolder = electronAPI?.showItemInFolder;
export const previewAssets = electronAPI?.previewAssets;
export const getFocusedWindow = electronAPI?.getFocusedWindow;
export const webviewOpenUrl = electronAPI?.webviewOpenUrl;
export const copyFile = electronAPI?.copyFile;
