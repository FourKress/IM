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
    <div v-if="isCall">接听</div>
    <div class="local-preview" ref="localTrtcContainer"></div>
    <div class="remote-preview" ref="remoteTrtcContainer"></div>
  </div>
</template>

<script>
import {
  startLocalPreview,
  stopLocalPreview,
  enterRoom,
  muteRemoteAudio,
  startRemoteView,
  startLocalAudio,
} from '../../TRTC-SDK';
import { LsIcon } from '@lanshu/components';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'Trtc-View',
  components: {
    LsIcon,
  },
  data() {
    return {
      isMin: 'min',
      isMax: 'max',
      isClose: 'close',
      isCall: false,
    };
  },
  async mounted() {
    this.$nextTick(() => {
      const cameraVideoDom = this.$refs.localTrtcContainer;
      startLocalAudio();
      startLocalPreview(cameraVideoDom);
    });
    const userInfo = await renderProcess.getStore('userInfo');
    const trtcMsg = await renderProcess.getStore('trtcMsg');
    console.log(userInfo, trtcMsg);
    const userId = userInfo.userId;
    const {
      toUser,
      fromUser = '',
      data: { roomId },
    } = trtcMsg;

    let remoteUserId;

    if (fromUser && fromUser !== userId) {
      this.isCall = true;
      remoteUserId = fromUser;
    } else {
      remoteUserId = toUser;
    }

    enterRoom(
      {
        userId,
        roomId,
      },
      'video',
    ).then(() => {
      const cameraVideoDom = this.$refs.remoteTrtcContainer;
      muteRemoteAudio(remoteUserId, true);
      startRemoteView(remoteUserId, cameraVideoDom);
    });
  },
  methods: {
    handleWindowChange(type) {
      console.log(type);
      if (type === 'close') {
        stopLocalPreview();
      }
      renderProcess.changeWindow(type, 'trtc');
    },
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

    -webkit-app-region: drag;

    .btn {
      height: 14px;
      margin-left: 18px;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .local-preview {
    position: absolute;
    width: 90px;
    height: 160px;
    top: 40px;
    left: 20px;
    border-radius: 6px;
  }

  .remote-preview {
    height: 100%;
  }
}
</style>
