import { Menu, Tray } from 'electron';
import path from 'path';
import { app } from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production';
const trayIconPath = isDevelopment
  ? './icons/icon.ico'
  : path.join(app.getPath('exe'), '/../resources/icons/icon.ico');

const trayAction = () => {
  // 设置托盘
  const tray = new Tray(trayIconPath);
  tray.setToolTip('蓝数IM');
  tray.on('click', () => {
    global.mainWindow.show();
  });

  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: '测试',
      click: () => {
        console.log(2222);
      },
    },
    {
      type: 'separator',
    },
    {
      label: '退出',
      role: 'quit',
    },
  ]);
  // 设置鼠标右键键事件
  tray.on('right-click', () => {
    tray.popUpContextMenu(trayContextMenu);
  });
};

export default trayAction;
