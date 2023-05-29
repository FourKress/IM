<template>
  <div class="trtc-view">
    <div class="top">
      <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_MIN)">
        <LsIcon icon="ls-icon-icon_zuixiaohua" size="14"></LsIcon>
      </span>
      <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_MAX)">
        <LsIcon
          :icon="`ls-icon-icon_${isFull ? 'quanpin' : 'suoxiao'}`"
          size="14"
        ></LsIcon>
      </span>
      <span class="btn" @click="handleWindowChange(WIN_ACTION_TYPE.IS_CLOSE)">
        <LsIcon icon="ls-icon-icon_guanbi" size="14"></LsIcon>
      </span>
    </div>
    <div class="user-panel" v-if="trtcSession.userId && !isEnterRoom">
      <img class="avatar" :src="trtcSession.avatar" alt="" />
      <div class="info">
        <span class="name">{{ trtcSession.nickname }}</span>
        <span class="tips">
          {{ isBeInvited ? `邀请你${callTypeLabel}通话` : '等待对方接听' }}...
        </span>
      </div>
    </div>

    <div class="opt-panel" v-if="optPanelVisible">
      <!--  接听方未进入房间  -->
      <div v-if="isBeInvited && !isEnterRoom" class="btn-list-await">
        <OptBtn
          tooltip="接听"
          :icon="`${
            isVideoCall ? 'ls-icon-icon_jieting' : 'ls-icon-icon_zhuanyuyin'
          }`"
          className="resolve"
          @action="handleResolve"
        />
        <OptBtn
          tooltip="拒绝"
          icon="ls-icon-icon_guaduan"
          className="reject"
          @action="handleReject"
        />
      </div>
      <!--  拨打方未进入房间  -->
      <div v-if="!isBeInvited && !isEnterRoom" class="btn-list-await">
        <OptBtn
          tooltip="取消"
          icon="ls-icon-icon_guaduan"
          className="reject"
          @action="handleCancel"
        />
      </div>

      <!--  进入房间  -->
      <div v-if="isEnterRoom" class="btn-list">
        <OptBtn
          v-if="isVideoCall"
          :tooltip="getToolTipLabel('摄像头', disSpeStatus)"
          :className="getClassName(disCamStatus)"
          :icon="`${
            disCamStatus ? 'icon_sheixnagtou_guanji' : 'icon_shexiangtou_dakai'
          }`"
          @action="handleCamera"
        />

        <OptBtn
          :tooltip="getToolTipLabel('麦克风', disSpeStatus)"
          :className="getClassName(disMicStatus)"
          :icon="microphoneIcon"
          @action="handleMicrophone"
        />

        <OptBtn
          :tooltip="getToolTipLabel('扬声器', disSpeStatus)"
          :className="getClassName(disSpeStatus)"
          :icon="`${
            disSpeStatus ? 'icon_yangshengqi_guanbi' : 'icon_yangshengqi_dakai'
          }`"
          @action="handleSpeaker"
        />

        <OptBtn
          tooltip="挂断"
          icon="ls-icon-icon_guaduan"
          className="reject"
          @action="handleCallEnd"
        />
      </div>
    </div>

    <div class="local" :class="isPc && 'pc'">
      <div
        class="local-preview"
        :class="!isEnterRoom && 'full'"
        ref="localTrtcContainer"
      ></div>
      <div class="local-bg" v-if="isEnterRoom">
        <img
          class="bg"
          :src="isPc ? LsAssets.trtcMePc : LsAssets.trtcBgMobile"
          alt=""
        />
        <img class="avatar" v-if="disCamStatus" :src="userInfo.avatar" alt="" />
        <img class="avatar"v-if="!isEnterRoom && !disCamStatus" :src="trtcSession.avatar" alt="" />
      </div>
    </div>

    <div class="remote">
      <div class="remote-preview" ref="remoteTrtcContainer"></div>

      <img
        class="remote-bg"
        :src="isPc ? LsAssets.trtcBgPc : LsAssets.trtcBgMobile"
        alt=""
      />
    </div>

    <div class="tips-wrap" v-if="tipsInfo.visible" :class="tipsInfo.className">
      {{ tipsInfo.text }}
    </div>
  </div>
</template>

<script>
import { LsIcon, LsAssets } from '@lanshu/components';
import {
  lodash,
  NETWORK_CALL_TYPE,
  WIN_ACTION_TYPE,
  WINDOW_TYPE,
  NETWORK_CALLBACK_TYPE,
  CLIENT_TYPE,
} from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import {
  IMStartNetworkCall,
  IMStopNetworkCall,
  IMAnswerNetworkCall,
} from '../../IM-SDK';
import OptBtn from './opt-btn.vue';
import trtcCloud from '../../TRTC-SDK';

export default {
  name: 'Trtc-View',
  components: {
    LsIcon,
    OptBtn,
  },
  computed: {
    callTypeLabel() {
      return this.isVideoCall ? '视频' : '语音';
    },
    microphoneIcon() {
      return `${
        this.disMicStatus ? 'icon_maikefeng_guanbi' : 'icon_maikefeng_dakai'
      }`;
    },
  },
  data() {
    return {
      LsAssets,
      WIN_ACTION_TYPE,
      WINDOW_TYPE,
      NETWORK_CALLBACK_TYPE,
      NETWORK_CALL_TYPE,
      isBeInvited: false,
      toUser: '',
      toUserType: '',
      roomId: '',
      userInfo: {},
      trtcSession: {},
      isEnterRoom: false,
      isExitRoom: false,
      isVideoCall: false,
      callType: '',
      callTime: 0,
      timer: 0,
      callUUID: null,
      disMicStatus: false,
      disSpeStatus: false,
      disCamStatus: false,
      isPc: true,
      platform: CLIENT_TYPE.IS_PC,
      debounceOptPanelVisible: null,
      optPanelVisible: true,
      tipsInfo: {},
      isFull: false,
    };
  },
  created() {
    console.log(trtcCloud.getCameraDevicesList());

    this.subscribeEvents();

    renderProcess.TRTCListener((event, message) => {
      console.log('TRTCListener', message);
      const { type, value } = message;
      switch (true) {
        case type === 'Close':
          const tipsMap = {
            671: '通话已结束',
            672: '对方已拒绝',
            673: '对方已取消',
            674: '未应答',
          };
          this.tipsInfo = {
            text: tipsMap[value],
            visible: true,
            className: 'waring',
          };
          this.handleTRTCDestroy();
          break;
        default:
          break;
      }
    });
  },

  async mounted() {
    this.initMouseEvent();

    const userInfo = await renderProcess.getStore('TRTC_USER_INFO');
    const trtcSession = await renderProcess.getStore('TRTC_SESSION');
    const trtcCallInfo = await renderProcess.getStore('TRTC_CALL_INFO');
    console.log(userInfo, trtcSession, trtcCallInfo);

    const { toUser, toUserType } = trtcSession;
    const {
      type,
      isBeInvited,
      roomId,
      platform = CLIENT_TYPE.IS_PC,
      uuid,
    } = trtcCallInfo;

    if (uuid) {
      this.callUUID = uuid;
    }
    this.platform = platform;
    this.isPc = platform === CLIENT_TYPE.IS_PC;
    this.isBeInvited = isBeInvited;
    this.callType = type;
    this.isVideoCall = type === this.NETWORK_CALL_TYPE.IS_VIDEO;

    this.toUser = toUser;
    this.toUserType = toUserType;
    this.roomId = roomId;
    this.userInfo = userInfo;
    this.trtcSession = trtcSession;

    if (this.isVideoCall) {
      trtcCloud.startLocalPreview(this.$refs.localTrtcContainer, this.isPc);
    }

    if (!isBeInvited) {
      this.startNetworkCall();
    }
  },
  methods: {
    initMouseEvent() {
      this.debounceOptPanelVisible = lodash.debounce(
        this.changeOptPanelVisible,
        3000,
      );
      document
        .querySelector('.trtc-view')
        .addEventListener('mousemove', this.handleMouseMove);
    },

    getClassName(status) {
      return status ? 'disabled' : '';
    },
    getToolTipLabel(text, status) {
      return `${text}已${status ? '关' : '开'}`;
    },

    handleMouseMove() {
      if (!this.optPanelVisible) {
        this.optPanelVisible = true;
      }
      this.debounceOptPanelVisible();
    },
    changeOptPanelVisible() {
      if (this.isEnterRoom) {
        this.optPanelVisible = false;
      }
    },

    startNetworkCall() {
      IMStartNetworkCall(this.toUser, this.toUserType, this.callType, {
        roomId: this.roomId,
        platform: this.platform,
      })
        .then((res) => {
          console.log('拨打回调', res);
          let waringText;
          const { type, uuid, data } = res;
          this.callUUID = uuid;

          const { platform = CLIENT_TYPE.IS_PC } = data;
          this.isPc = platform === CLIENT_TYPE.IS_PC;

          switch (type) {
            case this.NETWORK_CALLBACK_TYPE.IS_TIMEOUT:
              waringText = '对方未应答';
              break;
            case this.NETWORK_CALLBACK_TYPE.IS_REJECT:
              waringText = '对方已拒绝';
              break;
            case this.NETWORK_CALLBACK_TYPE.IS_ANSWERED:
              this.handleEnterRoom();
              this.startTime();
              setInterval(() => {
                this.timer++;
                if (this.timer >= 60 * 60 * 2) {
                  this.handleCallEnd('通话已达最大时长2小时，通话已结束');
                }
              }, 1000);
              break;
            default:
              break;
          }
          if (waringText) {
            this.tipsInfo = {
              text: waringText,
              visible: true,
              className: 'waring',
            };
            renderProcess.IMSDKNetworkCallRefresh(this.trtcSession.sessId);
            this.handleTRTCDestroy();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async stopNetworkCall() {
      await IMStopNetworkCall(
        this.callUUID,
        this.callType,
        this.toUser,
        this.toUserType,
        (Date.now() - this.callTime) / 1000,
      )
        .then((res) => {
          console.log(res);
          renderProcess.IMSDKNetworkCallRefresh(this.trtcSession.sessId);
          this.handleTRTCDestroy();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async answerNetworkCall() {
      await IMAnswerNetworkCall(
        this.callUUID,
        this.callType,
        this.toUser,
        this.toUserType,
        {
          platform: this.platform,
        },
      )
        .then((res) => {
          console.log(res);
          const { data = {} } = res;
          const { platform = CLIENT_TYPE.IS_PC, roomId } = data;
          this.isPc = platform === CLIENT_TYPE.IS_PC;
          this.roomId = roomId;
          this.handleEnterRoom();
          this.startTime();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleTRTCDestroy() {
      this.isExitRoom = true;
      setTimeout(() => {
        this.handleWindowChange(this.WIN_ACTION_TYPE.IS_CLOSE);
      }, 2000);
    },

    async handleWindowChange(type) {
      console.log(type);
      if (type !== this.WIN_ACTION_TYPE.IS_CLOSE) {
        if (type === this.WIN_ACTION_TYPE.IS_MAX) {
          this.isFull = !this.isFull;
        }
        renderProcess.changeWindow(type, this.WINDOW_TYPE.IS_TRTC);
        return;
      }

      if (this.isExitRoom) {
        await renderProcess.setStore('TRTC_CAN_BE_CLOSED', true);
        trtcCloud.stopLocalPreview();
        trtcCloud.stopLocalAudio();
        renderProcess.changeWindow(type, this.WINDOW_TYPE.IS_TRTC);
        return;
      }

      // 是否在房间
      if (this.isEnterRoom) {
        await this.handleCallEnd();
      } else {
        // 是否是接听方
        if (this.isBeInvited) {
          await this.handleReject();
        } else {
          await this.handleCancel();
        }
      }
    },

    handleEnterRoom() {
      this.isEnterRoom = true;

      trtcCloud.startLocalAudio();

      trtcCloud
        .enterRoom(
          {
            userId: this.userInfo.userId,
            roomId: this.roomId,
          },
          this.isVideoCall ? 'audio' : 'video',
        )
        .then(() => {
          trtcCloud.muteRemoteAudio(this.toUser, false);
          if (this.isVideoCall) {
            trtcCloud.startRemoteView(
              this.isPc,
              this.toUser,
              this.$refs.remoteTrtcContainer,
            );
          }
        });
    },

    async handleReject() {
      this.tipsInfo = {
        text: '通话已拒绝',
        visible: true,
        className: 'waring',
      };
      await this.stopNetworkCall();
    },

    async handleResolve() {
      await this.answerNetworkCall();
    },

    async handleCancel() {
      this.tipsInfo = {
        text: '通话已取消',
        visible: true,
        className: 'waring',
      };
      await this.stopNetworkCall();
    },

    async handleCallEnd(tips = '通话已结束') {
      await trtcCloud.exitRoom().then(() => {
        this.isExitRoom = true;
      });
      this.tipsInfo = {
        text: tips,
        visible: true,
        className: 'waring',
      };
      await this.stopNetworkCall();
    },

    async handleMicrophone() {
      this.disMicStatus = !this.disMicStatus;
      trtcCloud.muteLocalAudio(this.disMicStatus);
    },

    async handleSpeaker() {
      this.disSpeStatus = !this.disSpeStatus;
      trtcCloud.muteRemoteAudio(this.toUser, this.disSpeStatus);
    },

    async handleCamera() {
      this.disCamStatus = !this.disCamStatus;
      console.log(this.disCamStatus);
      if (this.disCamStatus) {
        trtcCloud.stopLocalPreview();
      } else {
        trtcCloud.startLocalPreview(this.$refs.localTrtcContainer, this.isPc);
      }
      trtcCloud.muteLocalVideo(this.disCamStatus);
    },

    startTime() {
      this.callTime = Date.now();
    },

    onUserVideoAvailable(userId, available) {
      console.log(`onUserVideoAvailable ${userId} ${available}`);
      if (available === 1) {
        trtcCloud.startRemoteView(
          this.isPc,
          userId,
          this.$refs.remoteTrtcContainer,
        );
      } else {
        trtcCloud.stopRemoteView(userId);
      }
    },

    onUserAudioAvailable(userId, available) {
      console.info(
        `onUserAudioAvailable: userId: ${userId}, available: ${available}`,
      );
      if (available) {
        trtcCloud.muteRemoteAudio(userId, false);
      } else {
        trtcCloud.muteRemoteAudio(userId, true);
      }
    },

    onFirstVideoFrame(uid, type, width, height) {
      console.log(`onFirstVideoFrame: ${uid} ${type} ${width} ${height}`);
    },

    onError(errCode, errMsg) {
      console.log('onError', errCode, errMsg);
    },

    onNetworkQuality(localQuality, remoteQuality) {
      const localQualityTips = trtcCloud.getNetworkQualityTips(localQuality);
      const remoteQualityTips = trtcCloud.getNetworkQualityTips(
        remoteQuality[0],
      );
      if (localQualityTips?.isError && localQualityTips?.errMsg) {
        this.tipsInfo = {
          text: `你的${localQualityTips.errMsg}`,
          visible: true,
          className: 'waring',
        };
      }
      if (remoteQualityTips?.isError && remoteQualityTips?.errMsg) {
        this.tipsInfo = {
          text: `对方的${remoteQualityTips.errMsg}`,
          visible: true,
          className: 'waring',
        };
      }
    },

    subscribeEvents() {
      trtcCloud.TRTC.on('onError', this.onError);
      trtcCloud.TRTC.on('onFirstVideoFrame', this.onFirstVideoFrame);
      trtcCloud.TRTC.on('onUserVideoAvailable', this.onUserVideoAvailable);
      trtcCloud.TRTC.on('onUserAudioAvailable', this.onUserAudioAvailable);
      trtcCloud.TRTC.on('onNetworkQuality', this.onNetworkQuality);
    },

    unsubscribeEvents() {
      trtcCloud.TRTC.off('onError', this.onError);
      trtcCloud.TRTC.off('onFirstVideoFrame', this.onFirstVideoFrame);
      trtcCloud.TRTC.off('onUserVideoAvailable', this.onUserVideoAvailable);
      trtcCloud.TRTC.off('onUserAudioAvailable', this.onUserAudioAvailable);
      trtcCloud.TRTC.off('onNetworkQuality', this.onNetworkQuality);
    },
  },
  destroyed() {
    this.unsubscribeEvents();
    document
      .querySelector('.trtc-view')
      .removeEventListener('mousemove', this.handleMouseMove);
  },
};
</script>

<style scoped lang="scss">
.trtc-view {
  height: 100%;
  position: relative;

  .top {
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    height: 44px;
    padding: 15px 17px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: $bg-white-color;

    -webkit-app-region: drag;

    .btn {
      margin-left: 18px;
      border-radius: 50%;
      cursor: pointer;

      &:first-child {
        transform: translateY(1px);
      }

      -webkit-app-region: no-drag !important;
    }
  }

  .user-panel {
    position: absolute;
    top: 40px;
    left: 20px;
    height: 60px;
    width: 100%;
    z-index: 4;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .avatar {
      display: block;
      width: 60px;
      height: 60px;
      margin-right: 12px;
      border-radius: 8px;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      color: $bg-white-color;

      .name {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 4px;
      }

      .tips {
        font-size: 12px;
      }
    }
  }

  .opt-panel {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 320px;
    height: 40px;
    z-index: 4;
  }

  .btn-list-await {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: $bg-white-color;
      margin: 0 24px;
      cursor: pointer;

      &.reject {
        background: #ff3b30;

        &:hover {
          background: #ff5e55;
        }
      }

      &.resolve {
        background: #4cd575;

        &:hover {
          background: #29bb55;
        }
      }
    }

    ::v-deep .ls-icon-wrap {
      transform-origin: center;
      transform: scale(1.8);
    }
  }

  .btn-list {
    width: 320px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $bg-white-color;
    background: rgba(51, 51, 51, 0.75);
    border-radius: 6px;
    padding: 0 34px;
    box-sizing: border-box;

    .btn {
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      text-align: center;
      border-radius: 6px;
      background: transparent;
      font-size: 18px;

      &.disabled {
        color: $tips-text-color;
      }

      &.left-btn {
        margin-right: 20px;
      }

      &.right-btn {
        margin-left: 20px;
      }

      &.reject {
        border-radius: 50%;
        color: $bg-white-color;
        background: #ff3b30;
        &:hover {
          background: #ff5e55;
        }
      }

      ::v-deep .ls-icon-wrap {
        transform-origin: center;
        transform: scale(1.2);
      }

      &:hover {
        background: $main-text-color;
      }
    }
  }

  .local {
    position: absolute;
    top: 40px;
    left: 16px;
    width: 90px;
    height: 160px;
    z-index: 1;

    &.pc {
      width: 146px;
      height: 82px;
      top: 16px;
    }

    .local-preview {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 6px;
      overflow: hidden;

      &.full {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1;
      }
    }

    .local-bg {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      border-radius: 6px;
      overflow: hidden;

      .avatar {
        display: block;
        width: 46px;
        height: 46px;
        border-radius: 6px;
      }

      .bg {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .remote {
    height: 100%;

    .remote-preview {
      display: block;
      width: 100%;
      height: 100%;
    }

    .remote-bg {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      border-radius: 16px;
      overflow: hidden;
    }
  }

  .tips-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 5;
    transform: translate(-50%, -50%);
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    font-size: 12px;
    padding: 0 20px;
    box-sizing: border-box;
    border: 1px solid transparent;

    &.waring {
      background: #fff4f4;
      border-color: #ff3b30;
      color: #ff3b30;
    }

    &.info {
      background: #bcc3cf;
      color: $main-text-color;
      border-color: transparent;
    }
  }
}
</style>
