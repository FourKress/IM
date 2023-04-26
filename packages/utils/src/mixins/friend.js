import { mapGetters, mapActions } from 'vuex';
import { IMGetByUserId, IMAgreeFriendAddRequest } from '@lanshu/im';

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
    handleJumIMPage(fnc) {
      this.$nextTick(() => {
        this.$router.push('/');
        fnc && fnc();
      });
    },

    async handleSendAuth(authParams) {
      await IMAgreeFriendAddRequest(...authParams);
      await this.handleSendMsg();
    },
    async handleSendMsg() {
      const res = await IMGetByUserId(this.friendInfo.userId);
      if (!res?.data) return;
      const session = res.data;
      this.handleCloseDialog();
      this.handleJumIMPage(() => {
        this.setMainSessionWindow(session);
      });
    },
    handleSendVideo() {
      this.handleCloseDialog();
      this.handleJumIMPage();
    },
    handleSendAudio() {
      this.handleCloseDialog();
      this.handleJumIMPage();
    },
  },
};
