<template>
  <div class="ls-user-tag">
    <span
      class="tag"
      :style="{ background: bgColor }"
      v-if="age || (sex && unSex)"
    >
      <LsIcon
        render-svg
        class="tag-icon"
        :icon="`ls-icon-${sex === this.SEX_TYPE.IS_MAN ? 'nan' : 'nv'}`"
        height="13"
        width="13"
        v-if="sex && unSex"
      ></LsIcon>
      {{ age ? `${age}岁` : '' }}
    </span>
    <span class="tag" v-if="addressLabel" :style="{ background: bgColor }">{{ addressLabel }}</span>
  </div>
</template>

<script>
import { Apis, SEX_TYPE } from '@lanshu/utils';
import LsIcon from './ls-icon.vue';

export default {
  name: 'Ls-User-Tag',
  props: {
    address: {
      type: String,
      required: true,
      default: '',
    },
    sex: {
      type: [Number, String],
      required: true,
      default: '',
    },
    age: {
      type: [Number, String],
      required: true,
      default: '',
    },
    bgColor: {
      type: String,
      default: '#F2F4F9',
    },
  },
  components: {
    LsIcon,
  },
  computed: {
    unSex() {
      return this.sex !== this.SEX_TYPE.IS_UNKNOWN;
    },
  },
  data() {
    return {
      SEX_TYPE,
      addressLabel: '',
    };
  },
  async mounted() {
    if (this.address) {
      const res = await Apis.managerRegionQuery({});
      const location = res?.data;
      const regions = this.address.split(',');
      const city = location.find((d) => d.code === regions[1]);
      const area = location.find((d) => d.code === regions[2]);
      this.addressLabel = `${city?.name}/${area?.name}`;
    } else {
      this.addressLabel = '';
    }
  },
};
</script>

<style scoped lang="scss">
.ls-user-tag {
  display: flex;
  align-items: flex-start;

  .tag {
    min-width: 42px;
    height: 22px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;

    font-size: 12px;
    font-weight: normal;
    color: #8f959e;

    &:first-child {
      margin-right: 7px;
    }

    .tag-icon {
      margin-right: 4px;
    }
  }
}
</style>
