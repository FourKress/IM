import { mapActions } from 'vuex';
import { IMGetByUserId } from '@lanshu/im';

export default {
  data() {
    return {};
  },

  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),

    async startSession(userId) {
      const res = await IMGetByUserId(userId);
      if (!res?.data) return;
      const session = res.data;
      await this.setMainSessionWindow(session);
      return session;
    },
  },
};
