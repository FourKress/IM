// 检查并申请设备权限：麦克风、摄像头、屏幕录制
import { systemPreferences } from 'electron';
import { IS_MAC } from './utils';
import { electronLog } from './log';

const checkDevices = async () => {
  const cameraPrivilege = systemPreferences.getMediaAccessStatus('camera');
  electronLog.info(
    `checkAndApplyDeviceAccessPrivilege before apply cameraPrivilege: ${cameraPrivilege}`,
  );
  if (cameraPrivilege !== 'granted') {
    IS_MAC && (await systemPreferences.askForMediaAccess('camera'));
  }

  const micPrivilege = systemPreferences.getMediaAccessStatus('microphone');
  electronLog.info(
    `checkAndApplyDeviceAccessPrivilege before apply micPrivilege: ${micPrivilege}`,
  );
  if (micPrivilege !== 'granted') {
    IS_MAC && (await systemPreferences.askForMediaAccess('microphone'));
  }

  const screenPrivilege = systemPreferences.getMediaAccessStatus('screen');
  electronLog.info(
    `checkAndApplyDeviceAccessPrivilege before apply screenPrivilege: ${screenPrivilege}`,
  );
};

export default checkDevices;
