import { mapGetters, mapActions } from 'vuex';
import { IMGetByUserId, IMAgreeFriendAddRequest } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';
import { CLIENT_TYPE, NETWORK_CALL_TYPE } from '../constant';

export default {
  data() {
    return {
      showFriendDialog: false,
      friendInfo: {},
      position: {},
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'sessionList']),
  },
  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),

    openFriendDialog(friend, event) {
      console.log(friend);
      this.friendInfo = friend;
      const clientWidth = document.body.clientWidth;
      // 网页宽度 - 面板宽度 = left的最大值，避免定位超出视图区
      const masLeft = clientWidth - 380;
      const { clientY, clientX } = event;
      this.position = {
        top: `${clientY}px`,
        left: masLeft >= clientX ? `${clientX}px` : `${masLeft}px`,
      };
      this.showFriendDialog = true;
    },

    handleCloseDialog() {
      this.showFriendDialog = false;
      this.friendInfo = {};
    },
    async handleJumIMPage(fnc) {
      const { userId } = this.friendInfo;
      this.handleCloseDialog();
      const session = await this.startSession(userId);
      this.$nextTick(() => {
        this.$router.push('/');
        fnc && fnc(session);
      });
    },
    async startSession(userId) {
      let session;
      const storeSession = this.sessionList.find((d) => d.toUser === userId);
      if (storeSession) {
        session = storeSession;
      } else {
        const res = await IMGetByUserId(userId);
        if (!res?.data) return;
        session = res.data;
      }
      await this.setMainSessionWindow(session);
      return session;
    },
    async startTrtc(session, NETWORK_CALL_TYPE) {
      await renderProcess.setStore('TRTC_SESSION', session);
      await renderProcess.setStore('TRTC_CALL_INFO', {
        type: NETWORK_CALL_TYPE,
        isBeInvited: false,
      });

      renderProcess.openTRTCWindow(CLIENT_TYPE.IS_PC);
    },

    async handleSendAuth(authParams) {
      await IMAgreeFriendAddRequest(...authParams);
      await this.handleSendMsg();
    },
    async handleSendMsg() {
      await this.handleJumIMPage();
    },
    async handleSendVideo() {
      await this.handleJumIMPage(async (session) => {
        await this.startTrtc(session, NETWORK_CALL_TYPE.IS_VIDEO);
      });
    },
    async handleSendAudio() {
      await this.handleJumIMPage(async (session) => {
        await this.startTrtc(session, NETWORK_CALL_TYPE.IS_AUDIO);
      });
    },
  },
};
