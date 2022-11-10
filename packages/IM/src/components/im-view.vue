<template>
  <div class="im-view">
    <div class="top">
      <div class="left">
        <div class="img"></div>
        <div class="info">
          <span class="name">阿斯达大</span>
          <span class="tips">顶顶顶顶</span>
        </div>
      </div>
      <div class="right">
        <div class="btn close"></div>
        <div class="btn switch"></div>
        <div class="btn text-icon-btn">
          <span class="btn-icon"></span>
          <span>协同</span>
        </div>
      </div>
    </div>
    <div class="message-panel"></div>
    <div class="action-panel">
      <div class="input-panel"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImView',
  created() {},
};
</script>

<style scoped lang="scss">
.im-view {
  height: 100%;
  background-color: #f6f7fb;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
  border-radius: 10px 10px 0 0;
  min-width: 500px;
  margin-left: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:first-child {
    margin-left: 0;
    flex: 1;
    border-radius: 0 10px 0 0;
  }

  .top {
    height: 66px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;

    .left {
      flex: 1;
      display: flex;
      align-items: center;

      .img {
        display: block;
        width: 46px;
        height: 46px;
        border-radius: 6px;
        margin-right: 10px;

        background: #9482ff;
      }

      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .name {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          margin-bottom: 5px;
        }

        .tips {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .right {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .btn {
        margin-right: 20px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        &.close {
          width: 16px;
          height: 16px;
          background-color: #333333;
        }

        &.switch {
          width: 16px;
          height: 16px;
          background-color: #333333;
        }

        &.text-icon-btn {
          width: 60px;
          height: 28px;
          background: #e7eaf3;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;
          color: #333333;

          .btn-icon {
            width: 12px;
            height: 12px;
            background-color: #333333;
            margin-right: 2px;
          }
        }
      }
    }
  }

  .message-panel {
    flex: 1;
  }

  .action-panel {
    width: 100%;
    height: 100px;
    padding: 20px;
    box-sizing: border-box;

    .input-panel {
      height: 60px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 10px;
      border: 2px solid rgba(148, 130, 255, 0.5);
    }
  }
}
</style>
