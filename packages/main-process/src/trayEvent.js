import { Menu, Tray } from 'electron';

const trayAction = () => {
  // 设置托盘
  const tray = new Tray('./icons/icon.ico');
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
