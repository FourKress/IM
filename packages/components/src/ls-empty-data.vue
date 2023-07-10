<template>
  <div class="empty-data">
    <div class="empty-container">
      <img :src="imgSrc" alt="" />
      <span class="tips">{{ tips }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Ls-Empty-data',
  props: {
    imgSrc: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.empty-data {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;

  .empty-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      width: 141px;
      height: 124px;
    }

    .tips {
      padding-top: 16px;
      font-size: 14px;
      color: $minor-text-color;
    }
  }
}
</style>
