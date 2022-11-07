const electronAPI = window?.electronAPI ?? {};

const openFile = electronAPI?.openFile;
const startScreenshots = electronAPI?.startScreenshots;
const getScreenshots = electronAPI?.getScreenshots;

export { openFile, startScreenshots, getScreenshots };
