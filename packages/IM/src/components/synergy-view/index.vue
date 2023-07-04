<template>
  <div class="synergy">
    <div class="top">
      <span class="left">协同</span>
      <span class="nav-list"></span>
      <span class="right"></span>
    </div>
    <div class="container">
      <div class="scroll-view">
        <div
          class="session"
          :style="session.style || getStyle"
          v-for="session in synergySessionList"
        >
          <ImView
            v-if="session.sessId"
            :key="session.sessId || ''"
            :session="session"
            :isFocus="false"
            :isSmallEditor="true"
          >
            <template slot="header">
              <div class="btn">
                <LsIcon
                  render-svg
                  icon="ls-icon-icon_quanpin"
                  @click="handleFull(session)"
                ></LsIcon>
              </div>
              <div class="btn">
                <LsIcon
                  render-svg
                  icon="ls-icon-a-icon_close2x"
                  @click="handleClose"
                ></LsIcon>
              </div>
            </template>
          </ImView>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LsIcon } from '@lanshu/components';
import ImView from '../im-view.vue';
import { lodash } from '@lanshu/utils';
export default {
  name: 'Synergy',
  components: {
    ImView,
    LsIcon,
  },
  provide() {
    return {
      isSettings: this.isSettings,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['sessionList']),

    getStyle() {
      const length = this.synergySessionList.length;
      let height = '40%';
      switch (length) {
        case 1:
          height = '100%';
          break;
        case 2:
          height = '50%';
          break;
        case 3:
          height = '40%';
          break;
      }
      return {
        height,
      };
    },
  },
  data() {
    return {
      synergySessionList: [],
    };
  },

  async created() {
    this.synergySessionList = lodash.cloneDeep(
      this.sessionList.filter((d, index) => index >= 0 && index <= 2),
    );
  },

  methods: {
    handleFull(session) {
      this.synergySessionList = this.synergySessionList.map((d) => {
        if (d.sessId === session.sessId) {
          d.style =
            d?.style?.height === '100%'
              ? this.getStyle
              : {
                  height: '100%',
                };
        }

        return { ...d };
      });

      console.log(1);
    },
    handleClose() {
      console.log('2');
    },
  },
};
</script>

<style scoped lang="scss">
.synergy {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    width: 100%;
    height: 50px;
    background-color: red;
    border-bottom: 1px solid #000;
  }

  .container {
    flex: 1;
    background-color: #2b83fa;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;

    .scroll-view {
      height: 100%;
      padding: 0 16px;
      box-sizing: border-box;
    }

    .session {
      width: 100%;
      min-height: 40%;
      margin-bottom: 16px;
    }
  }
}
</style>
