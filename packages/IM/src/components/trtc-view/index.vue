<template>
  <div class="trtc-view">
    <img
      class="bg"
      :src="isPc ? LsAssets.trtcBgPc : LsAssets.trtcBgMobile"
      alt=""
    />

    <div class="top">
      <span class="btn" @click="handleWindowChange(isMin)">
        <LsIcon icon="ls-icon-icon_zuixiaohua" size="14"></LsIcon>
      </span>
      <span class="btn" @click="handleWindowChange(isMax)">
        <LsIcon icon="ls-icon-icon_suoxiao" size="14"></LsIcon>
      </span>
      <span class="btn" @click="handleWindowChange(isClose)">
        <LsIcon icon="ls-icon-icon_guanbi" size="14"></LsIcon>
      </span>
    </div>
    <div class="user-panel" v-if="trtcSession.userId && !isEnterRoom">
      <img class="avatar" :src="trtcSession.avatar" alt="" />
      <div class="info">
        <span class="name">{{ trtcSession.nickname }}</span>
        <span class="tips">
          {{ isBeInvited ? `邀请你${callType}通话` : '等待对方接听' }}...
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
          tooltip="挂断"
          icon="ls-icon-icon_guaduan"
          className="reject"
          @action="handleReject"
        />
      </div>
      <!--  拨打方未进入房间  -->
      <div v-if="!isBeInvited && !isEnterRoom" class="btn-list-await">
        <OptBtn
          tooltip="挂断"
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

    <div
      class="local-preview"
      :class="isPc && 'pc'"
      v-if="isEnterRoom"
      ref="localTrtcContainer"
    >
      <div class="bg-wrap">
        <img
          class="bg"
          :src="isPc ? LsAssets.trtcMePc : LsAssets.trtcBgMobile"
          alt=""
        />
        <img class="avatar" :src="trtcSession.avatar" alt="" />
      </div>
    </div>
    <div class="remote-preview" ref="remoteTrtcContainer"></div>

    <div class="tips-wrap" v-if="tipsInfo.visible" :class="tipsInfo.className">
      {{ tipsInfo.text }}
    </div>
  </div>
</template>

<script>
import { LsIcon, LsAssets } from '@lanshu/components';
import { lodash } from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { IMCreateMsg, IMSDKMessageProvider, IMSendMessage } from '../../IM-SDK';
import trtcCloudInstance from '../../TRTC-SDK';
import OptBtn from './opt-btn.vue';

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
    OptBtn,
  },
  computed: {
    callType() {
      return this.isVideoCall ? '视频' : '语音';
    },
    microphoneTooltip() {
      return `麦克风已${this.disMicStatus ? '关' : '开'}`;
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
      isVideoCall: false,
      disMicStatus: false,
      disSpeStatus: false,
      disCamStatus: false,
      localTrtcContainer: null,
      remoteTrtcContainer: null,
      trtcCloud: null,
      isPc: false,
      debounceOptPanelVisible: null,
      optPanelVisible: true,
      tipsInfo: {},
      isFull: false,
    };
  },
  created() {
    this.trtcCloud = trtcCloudInstance();
  },

  async mounted() {
    this.debounceOptPanelVisible = lodash.debounce(
      this.changeOptPanelVisible,
      3000,
    );

    renderProcess.TRTCListener((event, message) => {
      console.log(message);
      // this.stopTime();
      // const {
      //   data: { trtcType },
      // } = message;
      // switch (true) {
      //   case trtcType === 1001:
      //     this.handleEnterRoom();
      //     break;
      //   case [1002, 1004, 1006].includes(trtcType):
      //     this.handleWindowChange('close');
      //     break;
      //   default:
      //     break;
      // }
    });

    const userInfo = await renderProcess.getStore('trtcUserInfo');
    const trtcMsg = await renderProcess.getStore('trtcMsg');
    const trtcSession = await renderProcess.getStore('trtcSession');
    console.log(userInfo, trtcMsg, trtcSession);
    const userId = userInfo.userId;
    const {
      toUser,
      toUserType,
      fromUser = '',
      data: { roomId },
      msgType,
    } = trtcMsg;

    console.log(msgType);

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
    this.msgType = msgType;
    this.isVideoCall = this.msgType === 100;

    this.$nextTick(() => {
      this.localTrtcContainer = this.$refs.localTrtcContainer;
      this.remoteTrtcContainer = this.$refs.remoteTrtcContainer;

      console.log(this.trtcCloud.getCameraDevicesList());

      this.trtcCloud.startLocalAudio();
      if (this.isVideoCall) {
        this.trtcCloud.startLocalPreview(this.remoteTrtcContainer);
      }

      document
        .querySelector('.trtc-view')
        .addEventListener('mousemove', this.handleMouseMove);
    });

    // this.startTime();
  },
  methods: {
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
      // this.debounceOptPanelVisible();
    },
    changeOptPanelVisible() {
      if (this.isEnterRoom) {
        this.optPanelVisible = false;
      }
    },

    async handleWindowChange(type, trtcType) {
      console.log(type);
      if (type !== this.isClose) {
        renderProcess.changeWindow(type, 'trtc');
        return;
      }

      if (type === this.isMax) {
        this.isFull = !this.isFull
      }

      this.tipsInfo = {
        text: '已挂断',
        visible: true,
        className: 'waring',
      };
      this.trtcCloud.stopLocalPreview();
      this.trtcCloud.stopLocalAudio();
      this.trtcCloud.stopAllRemoteView();
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
      setTimeout(() => {
        renderProcess.changeWindow(type, 'trtc');
      }, 1000);
    },

    handleEnterRoom() {
      this.trtcCloud.startLocalAudio();
      if (this.isVideoCall) {
        this.trtcCloud.startLocalPreview(this.localTrtcContainer);
      }

      this.trtcCloud
        .enterRoom(
          {
            userId: this.userInfo.userId,
            roomId: this.roomId,
          },
          this.isVideoCall ? 'audio' : 'video',
        )
        .then(() => {
          this.trtcCloud.muteRemoteAudio(this.remoteUserId, false);
          if (this.isVideoCall) {
            this.trtcCloud.startRemoteView(
              this.remoteUserId,
              this.remoteTrtcContainer,
            );
          }
          this.isEnterRoom = true;
        });
    },

    async handleExitRoom() {
      await this.trtcCloud.exitRoom().then(async () => {
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
      await this.handleWindowChange(this.isClose, 1002);
    },

    async handleResolve() {
      await this.handleSendIMMsg(1001);
      this.handleEnterRoom();
    },

    async handleCancel() {
      await this.handleWindowChange(this.isClose, 1005);
    },

    async handleCallEnd() {
      await this.handleSendIMMsg(1006);
    },

    async handleMicrophone() {
      this.disMicStatus = !this.disMicStatus;
      this.trtcCloud.muteLocalAudio(this.disMicStatus);
    },

    async handleSpeaker() {
      this.disSpeStatus = !this.disSpeStatus;
      this.trtcCloud.muteRemoteAudio(this.disSpeStatus, this.disSpeStatus);
    },

    async handleCamera() {
      this.disCamStatus = !this.disCamStatus;
      this.trtcCloud.muteLocalVideo(this.disCamStatus);
    },

    startTime() {
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.stopTime();
          if (!this.isBeInvited) {
            // this.handleWindowChange(this.isClose, 1004);
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
  destroyed() {
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

  .bg {
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
    bottom: 40px;
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

  .local-preview {
    position: absolute;
    top: 40px;
    left: 20px;
    width: 90px;
    height: 160px;
    border-radius: 6px;
    z-index: 9;
    overflow: hidden;

    &.pc {
      width: 146px;
      height: 82px;
    }

    .bg-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

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
      }
    }
  }

  .remote-preview {
    height: 100%;
  }

  .tips-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
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
