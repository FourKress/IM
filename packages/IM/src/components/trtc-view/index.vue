<template>
  <div class="trtc-view">
    <div class="top">
      <span class="btn" @click="handleWindowChange(isMin)">
        <LsIcon icon="navi_zxh_icon" width="14" height="14" render-svg></LsIcon>
      </span>
      <span class="btn" @click="handleWindowChange(isMax)">
        <LsIcon icon="navi_sx_icon" width="14" height="14" render-svg></LsIcon>
      </span>
      <span class="btn" @click="handleWindowChange(isClose)">
        <LsIcon icon="navi_gb_icon" width="14" height="14" render-svg></LsIcon>
      </span>
    </div>
    <div class="user-panel" v-if="trtcSession.userId">
      <img class="avatar" :src="isBeInvited ? userInfo.avatar : trtcSession.avatar" alt="" />
      <div class="info">
        <span class="name">{{ isBeInvited ? userInfo.nickname : trtcSession.nickname }}</span>
        <span class="tips">
          {{ isBeInvited ? `邀请你${callType}通话` : '等待对方接听' }}
        </span>
      </div>
    </div>
    <div v-if="isBeInvited && !isEnterRoom" class="btn-list">
      <span class="voice" @click="handleVoice">语音</span>
      <span class="resolve" @click="handleResolve">接听</span>
      <span class="reject" @click="handleReject">拒绝</span>
    </div>
    <div v-if="!isBeInvited && !isEnterRoom" class="btn-list">
      <span class="reject" @click="handleVoice">{{ callType }}</span>
      <span class="resolve" @click="handleCancel">取消</span>
      <span class="voice" @click="handleMicrophone">麦克风</span>
    </div>
    <div v-if="isEnterRoom" class="btn-list">
      <span class="reject" @click="handleVoice">{{ callType }}</span>
      <span class="resolve" @click="handleCamera">摄像头</span>
      <span class="voice" @click="handleCallEnd">挂断</span>
      <span class="voice" @click="handleMicrophone">麦克风</span>
      <span class="resolve" @click="handleSpeaker">扬声器</span>
    </div>
    <div class="local-preview" ref="localTrtcContainer"></div>
    <div class="remote-preview" ref="remoteTrtcContainer"></div>
  </div>
</template>

<script>
import {
  startLocalPreview,
  stopLocalPreview,
  enterRoom,
  exitRoom,
  muteRemoteAudio,
  startRemoteView,
  startLocalAudio,
  stopLocalAudio,
  stopAllRemoteView,
  muteLocalAudio,
  stopRemoteView,
  muteLocalVideo,
} from '../../TRTC-SDK';
import { LsIcon } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';
import { IMCreateMsg, IMSDKMessageProvider, IMSendMessage } from '../../IM-SDK';

// {
//   1000: '发起TRTC',
//   1001: '接听',
//   1002: '拒绝',
//   1003: '呼叫失败'
//   1004: '对方未接听',
//   1005: '主动取消',
//   1006: '通话结束'
//   1007: '音视频切换'
// }

export default {
  name: 'Trtc-View',
  components: {
    LsIcon,
  },
  computed: {
    callType() {
      return this.isVoice ? '语音' : '视频';
    },
  },
  data() {
    return {
      isMin: 'min',
      isMax: 'max',
      isClose: 'close',
      isBeInvited: false,
      toUser: '',
      toUserType: '',
      roomId: '',
      userInfo: {},
      trtcSession: {},
      remoteUserId: '',
      timer: null,
      countdown: 10,
      isEnterRoom: false,
      isVoice: false,
      disMicStatus: false,
      disSpeStatus: false,
      disCamStatus: false,
      localTrtcContainer: null,
      remoteTrtcContainer: null,
    };
  },
  async mounted() {
    renderProcess.IMSDKListener((event, data) => {
      const { type, value } = data;
      console.log(type, value);
    });
    renderProcess.TRTCListener((event, message) => {
      console.log(message);
      this.stopTime();
      const {
        data: { trtcType },
      } = message;
      switch (true) {
        case trtcType === 1001:
          this.handleEnterRoom();
          break;
        case [1002, 1004, 1006].includes(trtcType):
          this.handleWindowChange('close');
          break;
        case trtcType === 1007:
          this.handleVoice(true);
          break;
        default:
          break;
      }
    });

    this.$nextTick(() => {
      this.localTrtcContainer = this.$refs.localTrtcContainer;
      this.remoteTrtcContainer = this.$refs.remoteTrtcContainer;
    });

    const userInfo = await renderProcess.getStore('userInfo');
    const trtcMsg = await renderProcess.getStore('trtcMsg');
    const trtcSession = await renderProcess.getStore('trtcSession');
    console.log(userInfo, trtcMsg, trtcSession);
    const userId = userInfo.userId;
    const {
      toUser,
      toUserType,
      fromUser = '',
      data: { roomId },
    } = trtcMsg;

    let remoteUserId;

    if (fromUser && fromUser !== userId) {
      this.isBeInvited = true;
      remoteUserId = fromUser;
    } else {
      remoteUserId = toUser;
    }

    this.toUser = toUser;
    this.toUserType = toUserType;
    this.roomId = roomId;
    this.userInfo = userInfo;
    this.trtcSession = trtcSession;
    this.remoteUserId = remoteUserId;

    this.startTime();
  },
  methods: {
    async handleWindowChange(type, trtcType) {
      console.log(type);
      if (type === 'close') {
        stopLocalPreview();
        stopLocalAudio();
        stopAllRemoteView();
        if (trtcType) {
          await this.handleSendIMMsg(trtcType);
        } else {
          // 是否在房间
          if (this.isEnterRoom) {
            await this.handleExitRoom();
          } else {
            // 是否是接听方
            if (this.isBeInvited) {
              await this.handleReject();
            } else {
              await this.handleCancel();
            }
          }
        }
      }
      renderProcess.changeWindow(type, 'trtc');
    },

    handleEnterRoom() {
      startLocalAudio();
      if (!this.isVoice) {
        startLocalPreview(this.localTrtcContainer);
      }

      enterRoom(
        {
          userId: this.userInfo.userId,
          roomId: this.roomId,
        },
        'video',
      ).then(() => {
        muteRemoteAudio(this.remoteUserId, false);
        if (this.isVoice) {
          this.disCamStatus = true;
        } else {
          startRemoteView(this.remoteUserId, this.remoteTrtcContainer);
        }
        this.isEnterRoom = true;
      });
    },

    async handleExitRoom() {
      await exitRoom().then(async () => {
        await this.handleCallEnd;
      });
    },

    async handleSendIMMsg(trtcType) {
      this.stopTime();

      const msgData = [
        this.toUser, //消息接收方，为会话列表中的toUser
        this.toUserType, //消息接收方类型，为会话列表中的toUserType];
        100,
        {
          trtcType,
          roomId: 999,
        },
      ];
      const msg = await IMCreateMsg(
        IMSDKMessageProvider.events.createCustomMessage,
        msgData,
      );

      await IMSendMessage(msg);
    },

    async handleReject() {
      await this.handleWindowChange('close', 1002);
    },

    async handleResolve() {
      await this.handleSendIMMsg(1001);
      this.handleEnterRoom();
    },

    async handleCancel() {
      await this.handleWindowChange('close', 1005);
    },

    async handleCallEnd() {
      await this.handleSendIMMsg(1006);
    },

    async handleVoice(isEnd = false) {
      this.isVoice = !this.isVoice;
      if (this.isVoice) {
        stopLocalPreview();
        if (this.isEnterRoom) {
          stopRemoteView(this.remoteUserId);
        }
      } else {
        startLocalPreview(this.localTrtcContainer);
        if (this.isEnterRoom) {
          startRemoteView(this.remoteUserId, this.remoteTrtcContainer);
        }
      }
      if (isEnd) return;
      await this.handleSendIMMsg(1007);
    },

    async handleMicrophone() {
      this.disMicStatus = !this.disMicStatus;
      muteLocalAudio(this.disMicStatus);
    },

    async handleSpeaker() {
      this.disSpeStatus = !this.disSpeStatus;
      muteRemoteAudio(this.disSpeStatus, this.disSpeStatus);
    },

    async handleCamera() {
      if (this.isVoice) {
        return;
      }
      this.disCamStatus = !this.disCamStatus;
      muteLocalVideo(this.disCamStatus);
    },

    startTime() {
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.stopTime();
          if (!this.isBeInvited) {
            // this.handleWindowChange('close', 1004);
          }
        }
      }, 1000);
    },

    stopTime() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = null;
      this.countdown = 10;
    },
  },
};
</script>

<style scoped lang="scss">
.trtc-view {
  height: 100%;
  position: relative;
  background-color: #243a61;

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

    -webkit-app-region: drag;

    .btn {
      height: 14px;
      margin-left: 18px;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .user-panel {
    position: absolute;
    top: 40px;
    left: 20px;
    height: 60px;
    width: 100%;

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

  .btn-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    min-width: 230px;
    height: 40px;
    background: rgba(51, 51, 51, 0.75);
    border-radius: 6px;

    color: #fff;

    .min {
      width: 34px;
      height: 34px;
      margin: 0 40px;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  .local-preview {
    position: absolute;
    top: 40px;
    left: 20px;
    width: 90px;
    height: 160px;
    border-radius: 6px;
    z-index: 9;
    overflow: hidden;
  }

  .remote-preview {
    height: 100%;
  }
}
</style>
