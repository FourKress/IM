import TRTCCloud, {
  TRTCAppScene,
  TRTCParams,
  TRTCVideoStreamType,
  TRTCRenderParams,
  TRTCVideoRotation,
  TRTCVideoMirrorType,
  TRTCVideoFillMode,
  TRTCAudioQuality,
  TRTCVideoEncParam,
  TRTCVideoResolution,
  TRTCVideoResolutionMode,
  TRTCNetworkQosParam,
  TRTCVideoQosPreference,
} from 'trtc-electron-sdk';
import { genUserSig } from './utils';

const trtcCloud = new TRTCCloud();

const enterRoom = (params, type) => {
  return new Promise((resolve, reject) => {
    const rtcMap = {
      video: TRTCAppScene.TRTCAppSceneVideoCall,
      audio: TRTCAppScene.TRTCAppSceneAudioCall,
    };

    const { userId, roomId } = params;
    const userSigInfo = genUserSig(userId);
    const trtcParams = new TRTCParams();

    trtcParams.userId = userId;
    trtcParams.roomId = roomId;
    trtcParams.sdkAppId = userSigInfo.SDKAppID;
    trtcParams.userSig = userSigInfo.userSig;

    trtcCloud.enterRoom(trtcParams, rtcMap[type]);

    trtcCloud.on('onEnterRoom', (result) => {
      if (result > 0) {
        console.log('Enter room succeed');
        resolve();
      } else {
        console.log('Enter room failed');
        reject();
      }
    });
  });
};

const exitRoom = () => {
  return new Promise((resolve) => {
    trtcCloud.exitRoom();

    // 监听 onExitRoom 回调即可获知自己的退房原因
    trtcCloud.on('onExitRoom', (reason) => {
      // TODO 关闭摄像头之类
      console.log(`onExitRoom reason: ${reason}`);
      resolve(reason);
    });
  });
};

const muteLocalVideo = (status, videoType) => {
  const videoMap = {
    big: TRTCVideoStreamType.TRTCVideoStreamTypeBig,
    sub: TRTCVideoStreamType.TRTCVideoStreamTypeSub,
  };

  trtcCloud.muteLocalVideo(status, videoMap[videoType]);
};

const muteLocalAudio = (status) => {
  trtcCloud.muteLocalAudio(status);
};

const muteRemoteAudio = (userId, status) => {
  trtcCloud.muteRemoteAudio(userId, status);
};

const muteAllRemoteAudio = (status) => {
  trtcCloud.muteAllRemoteAudio(status);
};

const startRemoteView = (
  userId,
  cameraView,
  videoType = TRTCVideoStreamType.TRTCVideoStreamTypeBig,
) => {
  trtcCloud.startRemoteView(userId, cameraView, videoType);
};

const stopRemoteView = (
  userId,
  videoType = TRTCVideoStreamType.TRTCVideoStreamTypeBig,
) => {
  trtcCloud.stopRemoteView(userId, videoType);
};

const stopAllRemoteView = () => {
  trtcCloud.stopAllRemoteView();
};

const setRemoteRenderParams = (userId) => {
  const param = new TRTCRenderParams();
  param.fillMode = TRTCVideoFillMode.TRTCVideoFillMode_Fill;
  param.rotation = TRTCVideoRotation.TRTCVideoRotation0;
  param.mirrorType = TRTCVideoMirrorType.TRTCVideoMirrorType_Auto;
  trtcCloud.setRemoteRenderParams(
    userId,
    TRTCVideoStreamType.TRTCVideoStreamTypeBig,
    param,
  );
};

const setRemoteAudioVolume = (userId, volume) => {
  trtcCloud.setRemoteAudioVolume(userId, volume);
};

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

const setLocalRenderParams = () => {
  const param = new TRTCRenderParams();
  param.fillMode = TRTCVideoFillMode.TRTCVideoFillMode_Fill;
  param.rotation = TRTCVideoRotation.TRTCVideoRotation0;
  param.mirrorType = TRTCVideoMirrorType.TRTCVideoMirrorType_Auto;
  trtcCloud.setLocalRenderParams(param);
};

const startLocalPreview = (cameraVideoDom) => {
  setLocalRenderParams();
  trtcCloud.startLocalPreview(cameraVideoDom);
};

const stopLocalPreview = () => {
  trtcCloud.stopLocalPreview();
};

const startLocalAudio = (type = TRTCAudioQuality.TRTCAudioQualitySpeech) => {
  // 开启麦克风采集，并设置当前场景为：语音模式（高噪声抑制能力、强弱网络抗性）
  trtcCloud.startLocalAudio(type);
};

const stopLocalAudio = () => {
  // 开启麦克风采集，并设置当前场景为：语音模式（高噪声抑制能力、强弱网络抗性）
  trtcCloud.stopLocalAudio();
};

const setVideoEncoderParam = () => {
  const params = new TRTCVideoEncParam();
  params.videoResolution = TRTCVideoResolution.TRTCVideoResolution_640_360;
  params.resMode = TRTCVideoResolutionMode.TRTCVideoResolutionModePortrait;
  params.videoFps = 20;
  params.videoBitrate = 550;
  params.enableAdjustRes = true;
  trtcCloud.setVideoEncoderParam(params);
};

const setNetworkQosParam = () => {
  const params = new TRTCNetworkQosParam();
  params.preference = TRTCVideoQosPreference.TRTCVideoQosPreferenceSmooth;
  trtcCloud.setNetworkQosParam(params);
};

const muteRemoteVideoStream = (userId, status) => {
  trtcCloud.muteRemoteVideoStream(
    userId,
    status,
    TRTCVideoStreamType.TRTCVideoStreamTypeBig,
  );
};
const muteAllRemoteVideoStreams = (status) => {
  trtcCloud.muteAllRemoteVideoStreams(status);
};

const setAudioCaptureVolume = (volume) => {
  trtcCloud.setAudioCaptureVolume(volume);
};

const getAudioCaptureVolume = () => {
  trtcCloud.getAudioCaptureVolume();
};

const setAudioPlayoutVolume = (volume) => {
  trtcCloud.setAudioPlayoutVolume(volume);
};

const getAudioPlayoutVolume = () => {
  trtcCloud.getAudioPlayoutVolume();
};

const enableAudioVolumeEvaluation = (interval) => {
  trtcCloud.enableAudioVolumeEvaluation(interval);
};

export {
  enterRoom,
  exitRoom,
  startLocalPreview,
  stopLocalPreview,
  muteLocalVideo,
  startRemoteView,
  stopRemoteView,
  stopAllRemoteView,
  muteRemoteVideoStream,
  muteAllRemoteVideoStreams,
  setVideoEncoderParam,
  setNetworkQosParam,
  setLocalRenderParams,
  setRemoteRenderParams,
  startLocalAudio,
  stopLocalAudio,
  muteLocalAudio,
  muteRemoteAudio,
  muteAllRemoteAudio,
  setAudioCaptureVolume,
  getAudioCaptureVolume,
  setAudioPlayoutVolume,
  getAudioPlayoutVolume,
  enableAudioVolumeEvaluation,
  setRemoteAudioVolume,
};
