import Drawer from './drawer';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Drawer,
  },
  methods: {
    handleCloseDrawer() {
      this.$emit('update:visible', false);
    },
  },
};
