<template>
  <span class='ls-icon-wrap'>
    <!-- svg -->
    <svg
      v-if="renderSvg"
      aria-hidden="true"
      class="ls-icon-svg"
      :style="svgStyle"
      @click="handClick"
    >
      <use :xlink:href="`#${iconClass}`"></use>
    </svg>
    <!-- class模式 -->
    <i
      v-else
      class="ls-icon ls-icon-font"
      :class="iconClass"
      :style="iconStyle"
      @click="handClick"
    ></i>
  </span>
</template>

<script>
import _ from 'lodash';
import { lodash } from '@lanshu/utils';

export default {
  name: 'Ls-Icon',
  props: {
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    renderSvg: {
      type: Boolean,
      default: false,
    },
    size: [String, Number],
    width: [String, Number],
    height: [String, Number],
  },
  computed: {
    iconClass() {
      const { icon } = this;
      // 兼容icon写法，可写全名或者省略 ls-icon 前缀
      return icon.includes('ls-icon') ? icon : `ls-icon-${icon}`;
    },
    svgStyle() {
      const { color, width, height } = this;
      return {
        color,
        width: width || 18,
        height: height || 18,
      };
    },
    iconStyle() {
      const { size, color } = this;
      return {
        fontSize: size ? `${size}px` : '',
        color,
      };
    },
  },
  methods: {
    handClick: lodash.debounce(
      function () {
        // 防抖
        this.$emit('click');
      },
      300,
      { leading: true, trailing: false },
    ),
  },
};
</script>
<style lang="scss" scoped>

.ls-icon-wrap {
  //width: 100%;
  //height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ls-icon {
  &-svg {
    display: inline-block;
    vertical-align: middle;
    color: inherit;
  }
  &-font {
    display: inline-block;
    vertical-align: middle;
    color: inherit;
  }
}
</style>
