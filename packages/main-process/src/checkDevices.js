// 检查并申请设备权限：麦克风、摄像头、屏幕录制
import { systemPreferences } from 'electron';

const checkDevices = async () => {
  const cameraPrivilege = systemPreferences.getMediaAccessStatus('camera');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply cameraPrivilege: ${cameraPrivilege}`,
  );
  if (cameraPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('camera');
  }

  const micPrivilege = systemPreferences.getMediaAccessStatus('microphone');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply micPrivilege: ${micPrivilege}`,
  );
  if (micPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('microphone');
  }

  const screenPrivilege = systemPreferences.getMediaAccessStatus('screen');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply screenPrivilege: ${screenPrivilege}`,
  );
};

export default checkDevices;
