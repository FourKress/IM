import { TRTCQuality } from 'trtc-electron-sdk';

export const registryCallback = (trtcCloud) => {
  console.log('registryCallback');
  trtcCloud.on('onError', (errCode, errMsg) => {
    // errorCode 可参考 https://cloud.tencent.com/document/product/647/32257#.E9.94.99.E8.AF.AF.E7.A0.81.E8.A1.A8
    console.log('onError', errCode, errMsg);
  });

  trtcCloud.on('onWarning', (errCode, errMsg) => {
    // errorCode 可参考 https://cloud.tencent.com/document/product/647/32257#.E9.94.99.E8.AF.AF.E7.A0.81.E8.A1.A8
    console.log('onWarning', errCode, errMsg);
  });

  // TODO 数据共享
  let openCameraUserList = [];
  let openMicUserList = [];

  function onUserVideoAvailable(userId, available) {
    if (available === 1) {
      openCameraUserList.push(userId);
    } else {
      openCameraUserList = openCameraUserList.filter((item) => item !== userId);
    }
  }

  function onUserAudioAvailable(userId, available) {
    if (available === 1) {
      openMicUserList.push(userId);
    } else {
      openMicUserList = openMicUserList.filter((item) => item !== userId);
    }
  }

  trtcCloud.on('onUserVideoAvailable', onUserVideoAvailable);
  trtcCloud.on('onUserAudioAvailable', onUserAudioAvailable);

  trtcCloud.on('onNetworkQuality', (localQuality, remoteQuality) => {
    console.log('onNetworkQuality');
    switch (localQuality.quality) {
      case TRTCQuality.TRTCQuality_Unknown:
        console.log('SDK has not yet sensed the current network quality.');
        break;
      case TRTCQuality.TRTCQuality_Excellent:
        console.log('The current network is very good.');
        break;
      case TRTCQuality.TRTCQuality_Good:
        console.log('The current network is good.');
        break;
      case TRTCQuality.TRTCQuality_Poor:
        console.log('The current network quality barely meets the demand.');
        break;
      case TRTCQuality.TRTCQuality_Bad:
        console.log(
          'The current network is poor, and there may be significant freezes and call delays.',
        );
        break;
      case TRTCQuality.TRTCQuality_Vbad:
        console.log(
          'The current network is very poor, the communication quality cannot be guaranteed.',
        );
        break;
      case TRTCQuality.TRTCQuality_Down:
        console.log(
          'The current network does not meet the minimum requirements.',
        );
        break;
      default:
        break;
    }
    for (let i = 0; i < remoteQuality.length; i++) {
      console.log(
        `remote user: ${remoteQuality[i].userId}, quality: ${remoteQuality[i].quality}`,
      );
    }
  });
};
