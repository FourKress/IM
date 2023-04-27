import { mapGetters, mapActions } from 'vuex';
import { IMGetByUserId, IMAgreeFriendAddRequest } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';
import { clientType, networkCallType } from '../constant';

export default {
  data() {
    return {
      showFriendDialog: false,
      friendInfo: {},
      position: {},
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
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
      const res = await IMGetByUserId(userId);
      if (!res?.data) return;
      const session = res.data;
      await this.setMainSessionWindow(session);
      return session;
    },
    async startTrtc(session, networkCallType) {
      await renderProcess.setStore('trtcSession', session);
      await renderProcess.setStore('trtcCallInfo', {
        type: networkCallType,
        isBeInvited: false,
      });

      renderProcess.openTRTCWindow(clientType.isPc);
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
        await this.startTrtc(session, networkCallType.isVideo);
      });
    },
    async handleSendAudio() {
      await this.handleJumIMPage(async (session) => {
        await this.startTrtc(session, networkCallType.isAudio);
      });
    },
  },
};
