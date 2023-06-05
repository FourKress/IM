import Drawer from './drawer';

export default {
  props: {
    visibleDrawer: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Drawer,
  },
  methods: {
    handleCloseDrawer() {
      this.$emit('update:visibleDrawer', false);
    },
  },
};
