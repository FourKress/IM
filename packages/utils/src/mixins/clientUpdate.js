import { renderProcess } from '@lanshu/render-process';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      visibleUpdate: false,
    };
  },
  computed: {
    ...mapGetters('globalStore', ['updateNotify', 'updateInfo']),
  },

  methods: {
    ...mapActions('globalStore', ['setStartDownload']),

    handleUpdate() {
      this.visibleUpdate = true;
    },

    async handleStartUpdate() {
      this.visibleUpdate = false;
      await this.setStartDownload(true);
      const { fetchUrl, version } = this.updateInfo;
      renderProcess.checkForUpdates({ fetchUrl, version });
    },
  },
};
