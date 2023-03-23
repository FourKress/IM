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
      const masLeft = clientWidth - 380;
      const { clientY, clientX } = event;
      this.position = {
        top: `${clientY}px`,
        left: masLeft >= clientX ? `${clientX}px` : `${masLeft}px`,
      };
      this.showFriendDialog = true;
    },
  },
};
