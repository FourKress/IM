<template>
  <div class="row">
    <RowChat label="消息置顶">
      <span slot="right-btn" class="check-btn">
        <el-switch
          v-model="topStatus"
          active-color="#0066FF"
          inactive-color="#C9CDD4"
          @change='setMsgTopStatus'
        ></el-switch>
      </span>
    </RowChat>
<!--    <RowChat label="消息免打扰">-->
<!--      <span slot="right-btn" class="check-btn">-->
<!--        <el-switch-->
<!--          v-model="silence"-->
<!--          active-color="#0066FF"-->
<!--          inactive-color="#C9CDD4"-->
<!--          @change='setMsgSilence'-->
<!--        ></el-switch>-->
<!--      </span>-->
<!--    </RowChat>-->
  </div>
</template>

<script>
import RowChat from '../group-panel/row-chat';
import { IMSetTopStatus } from '../../IM-event';
import { mapGetters } from 'vuex';

export default {
  name: 'MsgTopAndSilence',
  components: {
    RowChat,
  },
  data() {
    return {
      topStatus: false,
      silence: false,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['actionWindow']),
  },
  watch: {
    actionWindow: {
      deep: true,
      handler(val) {
        this.topStatus = val.topState === 1;
      }
    }
  },
  mounted() {
    this.topStatus = this.actionWindow.topState === 1;
  },
  methods: {
    setMsgTopStatus(topStatus) {
      console.log(this.actionWindow.sessId, topStatus);
      IMSetTopStatus(this.actionWindow.sessId, topStatus).then(() => {
        console.log('TopStatus Success');
      });
    },
    setMsgSilence() {},
  },
};
</script>

<style scoped></style>
