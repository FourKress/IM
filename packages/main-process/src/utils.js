import { dialog, globalShortcut } from 'electron';

export const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return false;
  }
  return filePaths[0];
};
