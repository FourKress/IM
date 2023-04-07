<template>
  <div class="ls-user-tag">
    <span class="tag" :style="{background: bgColor}">
      <LsIcon
        render-svg
        class="tag-icon"
        :icon="`ls-icon-${sex === '1' ? 'nan' : 'nv'}`"
        height="13"
        width="13"
      ></LsIcon>
      {{ age ? `${age}岁` : '' }}
    </span>
    <span class="tag" :style="{background: bgColor}">{{ address }}</span>
  </div>
</template>

<script>
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
      default: '#F2F4F9'
    }
  },
  components: {
    LsIcon,
  },
};
</script>

<style scoped lang="scss">
.ls-user-tag {
  display: flex;
  align-items: flex-start;

  .tag {
    min-width: 58px;
    height: 22px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;

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
