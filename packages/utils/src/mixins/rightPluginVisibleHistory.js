import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow']),
  },

  methods: {
    async getRightPluginVisibleHistory() {
      const { sessId } = this.mainSessionWindow;
      const rightPluginVisibleHistory =
        (await window.$sessionStore.getItem('rightPluginVisibleHistory')) || {};

      const curHistoryData = rightPluginVisibleHistory[sessId] || {};

      return {
        historyData: rightPluginVisibleHistory,
        curKey: sessId,
        curHistoryData,
      };
    },

    async setRightPluginVisibleHistory(appKey, visible) {
      const { historyData, curKey } = await this.getRightPluginVisibleHistory();
      await window.$sessionStore.setItem('rightPluginVisibleHistory', {
        ...historyData,
        [curKey]: {
          appKey,
          visible,
        },
      });
    },
  },
};
