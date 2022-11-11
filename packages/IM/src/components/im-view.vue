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

    <div class="message-panel">
      <div
        class="message-item"
        :class="index % 2 === 0 ? 'target' : 'self'"
        v-for="(item, index) in messageList"
      >
        <div class="img"></div>
        <div class="info">
          非首发舒舒服服师傅师傅水电费舒服舒服水电费水电费神鼎飞丹砂非首发舒舒服服师傅师傅水电费舒服舒服水电费水电费神鼎飞丹砂非首发舒舒服服师傅师傅水电费舒服舒服水电费水电费神鼎飞丹砂
        </div>
      </div>
    </div>

    <div class="action-panel">
      <div class="input-panel">
        <div class="input-wrap">
          <input type="text" placeholder="发送给 休息下..." />
          <div class="btn-list">
            <div class="btn"></div>
            <div class="btn"></div>
            <div class="btn"></div>
            <div class="btn"></div>
          </div>
        </div>
        <div class="send-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImView',
  data() {
    return {
      messageList: new Array(30).fill(''),
    };
  },
  created() {},
};
</script>

<style scoped lang="scss">
.im-view {
  height: 100%;
  background-color: #f6f7fb;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
  border-radius: 10px 10px 0 0;
  width: 500px;
  min-width: 500px;
  margin-left: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translate3d(0, 0, 0);

  &:first-child {
    margin-left: 0;
    flex: 1;
    border-radius: 0 10px 0 0;
    width: auto;
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
    padding: 20px 20px 0 20px;
    overflow-y: auto;
    transform: translate3d(0, 0, 0);

    .message-item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-bottom: 16px;
      transform: translate3d(0, 0, 0);

      &:last-child {
        margin-bottom: 0;
      }

      .img {
        width: 50px;
        min-width: 50px;
        height: 50px;
        background: #9482ff;
        border-radius: 6px;
      }

      .info {
        min-height: 50px;
        padding: 15px;
        box-sizing: border-box;
        background: #e7eaf3;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        font-size: 14px;
        color: #333333;
        line-height: 20px;
      }

      &.self {
        padding-left: 60px;
        flex-flow: row-reverse;

        .img {
          margin-left: 10px;
        }
      }

      &.target {
        padding-right: 60px;

        .img {
          margin-right: 10px;
        }
      }
    }
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
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .input-wrap {
        flex: 1;
        height: 28px;
        border-right: 1px solid #eaeaea;
        font-size: 14px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn-list {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-left: 16px;

          .btn {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-right: 20px;
            background-color: #333333;
          }
        }

        input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
        }

        input::placeholder {
          color: #999999;
          font-size: 14px;
        }
      }

      .send-btn {
        width: 18px;
        height: 18px;
        cursor: pointer;
        margin-left: 17px;
        background-color: #333333;
      }
    }
  }
}
</style>
