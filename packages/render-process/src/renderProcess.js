const electronAPI = window?.electronAPI ?? {};

const changeWindow = electronAPI?.changeWindow;
const openFile = electronAPI?.openFile;
const startScreenshots = electronAPI?.startScreenshots;
const getScreenshots = electronAPI?.getScreenshots;

export { changeWindow, openFile, startScreenshots, getScreenshots };
