import { mapActions, mapGetters } from 'vuex';
import { IMGetByUserId } from '@lanshu/im';

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters('IMStore', ['sessionList']),
  },

  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),

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
  },
};
