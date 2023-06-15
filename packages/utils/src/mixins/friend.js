import { mapGetters, mapActions } from 'vuex';
import {
  IMGetByUserId,
  IMAgreeFriendAddRequest,
  IMFriendAddRequest,
  IMSDKMessageProvider,
  IMSendMessage,
} from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';
import { Apis } from '@lanshu/utils';
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
    ...mapGetters('globalStore', ['systemUserInfo']),
  },
  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow', 'setRefreshMsg']),

    async openFriendDialog(event, cb, computedHeight) {
      this.friendInfo = {};
      const { clientWidth, clientHeight } = document.body;
      // 网页宽度 - 面板宽度 = left的最大值，避免定位超出视图区
      const maxLeft = clientWidth - 400;
      const maxHeight = clientHeight - (computedHeight || 500);
      const { clientY, clientX } = event;
      this.position = {
        top: maxHeight >= clientY ? `${clientY}px` : `${maxHeight}px`,
        left: maxLeft >= clientX ? `${clientX}px` : `${maxLeft}px`,
      };
      this.showFriendDialog = true;
      if (cb && typeof cb === 'function') {
        const friend = await cb();

        const res = await Apis.userDepartAndOrganization({
          userId: friend.userId,
        });
        const userDepInfo = res?.data || {};

        if (userDepInfo.orgId === this.systemUserInfo?.currentOrg?.id) {
          const roleCodeMap = {
            generalUser: '普通成员',
            departAdmin: '部门管理员',
            cooperateAdmin: '协作管理员',
            orgAdmin: '组织管理员',
            platformAdmin: '平台管理员',
          };
          const { phone, roleCode, orgName, departList = [] } = userDepInfo;
          this.friendInfo = {
            ...friend,
            phone,
            roleCode: roleCodeMap[roleCode],
            org: orgName,
            dep: departList.map((d) => d.name)?.join('/'),
          };
        } else {
          this.friendInfo = friend;
        }
      }
    },

    handleCloseDialog() {
      this.showFriendDialog = false;
      this.friendInfo = {};
    },
    handleSendApply(addParams) {
      IMFriendAddRequest(...addParams).then(() => {
        this.handleCloseDialog();
      });
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
      await this.handleJumIMPage(async (session) => {
        const msgData = [
          session.toUser,
          session.toUserType,
          '我们已经是好友啦，现在可以聊天了！',
        ];
        const msg = await renderProcess.IMSDKIPC(
          IMSDKMessageProvider.provider,
          IMSDKMessageProvider.events.createTextMessage,
          ...msgData,
        );
        IMSendMessage(msg).finally(() => {
          this.setRefreshMsg(Date.now());
        });
      });
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
