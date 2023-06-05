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
  TRTCQuality,
} from 'trtc-electron-sdk';
import { genUserSig } from './utils';

const trtcCloudInstance = () => {
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

  const muteLocalVideo = (
    status,
    videoType = TRTCVideoStreamType.TRTCVideoStreamTypeBig,
  ) => {
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
    isPc,
    userId,
    cameraView,
    videoType = TRTCVideoStreamType.TRTCVideoStreamTypeBig,
  ) => {
    setRemoteRenderParams(userId);
    setVideoEncoderParam(isPc);
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
    const param = new TRTCRenderParams(
      TRTCVideoRotation.TRTCVideoRotation0,
      TRTCVideoFillMode.TRTCVideoFillMode_Fill,
      TRTCVideoMirrorType.TRTCVideoMirrorType_Auto,
    );
    trtcCloud.setRemoteRenderParams(
      userId,
      TRTCVideoStreamType.TRTCVideoStreamTypeBig,
      param,
    );
  };

  const setRemoteAudioVolume = (userId, volume) => {
    trtcCloud.setRemoteAudioVolume(userId, volume);
  };

  const setLocalRenderParams = () => {
    const param = new TRTCRenderParams(
      TRTCVideoRotation.TRTCVideoRotation0,
      TRTCVideoFillMode.TRTCVideoFillMode_Fill,
      TRTCVideoMirrorType.TRTCVideoMirrorType_Auto,
    );
    trtcCloud.setLocalRenderParams(param);
  };

  const startLocalPreview = (cameraVideoDom, isPc) => {
    setLocalRenderParams();
    setVideoEncoderParam(isPc);
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
    trtcCloud.stopLocalAudio();
  };

  const setVideoEncoderParam = (isPc) => {
    const params = new TRTCVideoEncParam();
    params.videoResolution = TRTCVideoResolution.TRTCVideoResolution_640_360;
    if (isPc) {
      params.resMode = TRTCVideoResolutionMode.TRTCVideoResolutionModeLandscape;
    } else {
      params.resMode = TRTCVideoResolutionMode.TRTCVideoResolutionModePortrait;
    }
    params.videoFps = 24;
    params.videoBitrate = 1300;
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

  const getCameraDevicesList = () => {
    return trtcCloud.getCameraDevicesList();
  };

  const getMicDevicesList = () => {
    return trtcCloud.getMicDevicesList();
  };

  const getSpeakerDevicesList = () => {
    return trtcCloud.getSpeakerDevicesList();
  };

  const getNetworkQualityTips = (quality) => {
    if (
      [
        TRTCQuality.TRTCQuality_Good,
        TRTCQuality.TRTCQuality_Excellent,
      ].includes(quality)
    ) {
      return {
        isError: false,
        errMsg: '',
      };
    }

    if (quality === TRTCQuality.TRTCQuality_Unknown) {
      return {
        isError: true,
        errMsg: '网络状态异常',
      };
    }

    if (quality === TRTCQuality.TRTCQuality_Unknown) {
      return {
        isError: true,
        errMsg: '网络质量差',
      };
    }
  };

  return {
    TRTC: trtcCloud,

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
    getCameraDevicesList,
    getNetworkQualityTips,
    getMicDevicesList,
    getSpeakerDevicesList,
  };
};

export default trtcCloudInstance();
