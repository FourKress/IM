export default {
  data() {
    return {
      showFriendDialog: false,
      friendInfo: {},
      position: {},
    };
  },
  methods: {
    openFriendDialog(friend, event) {
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
    },
    handleJumIMPage(fnc) {
      this.$nextTick(() => {
        this.$router.push('/');
        fnc && fnc();
      });
    },

    handleSendAuth() {
      this.handleCloseDialog();
      this.handleJumIMPage();
    },
    handleSendMsg() {
      this.handleCloseDialog();
      this.handleJumIMPage();
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
