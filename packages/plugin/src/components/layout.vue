<template>
  <div id="client-plugIn">
    <div class="main-wrap">
      <div class="form-panel"></div>
      <div class="plugin-menu">
        <div class="item">
          <div class='mask'></div>
          <div class="item-container">
            <div class="item-wrap">
              <div class="menu-icon"></div>
              <span class="text">发放</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="left">
        <div class="row">
          <span class="point"></span>
          <span>咨询用时：</span>
          <span>01:23</span>
        </div>
        <div class="row disabled">
          <span class="point"></span>
          <span>办理用时：</span>
          <span>01:23</span>
        </div>
      </div>

      <div class="right">
        <div class="end-btn">结束办理</div>
        <div class="start-btn">开始办理</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainPlugIn',
  components: {},
};
</script>

<style scoped lang="scss">
#client-plugIn {
  width: 565px;
  background: #fff;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.1);
  border-radius: 10px 10px 0 0;
  margin-left: 6px;

  display: flex;
  flex-direction: column;

  .main-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-start;

    .form-panel {
      flex: 1;
      background-color: #fff;
    }

    .plugin-menu {
      width: 68px;
      //background: linear-gradient(
      //  360deg,
      //  #dde2ef 0%,
      //  #edecf5 24%,
      //  #f5f2ec 56%,
      //  #dfe6ea 81%,
      //  #dde2ef 100%
      //);
      //opacity: 0.4;
      background-color: #F2F4F9;
      padding-top: 66px;

      .item {
        width: 68px;
        height: 76px;
        padding: 10px 0;
        box-sizing: border-box;
        display: flex;
        background-color: transparent;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        cursor: pointer;
        position: relative;

        .mask {
          width: 10px;
          height: 100%;
          background-color: #fff;
          position: absolute;
          left: 0;
          z-index: 1;
        }

        .item-container {
          width: 100%;
          height: 56px;

          .item-wrap {
            width: 100%;
            height: 56px;
            text-align: center;
            background: #fff;
            //box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.1);
            border-radius: 0 10px 10px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .menu-icon {
              width: 20px;
              height: 20px;
              background-color: #333333;
            }

            .text {
              margin-top: 4px;
              font-size: 12px;
              font-weight: bold;
              color: #0066ff;
            }
          }
        }

        &:before, &:after {
          position: absolute;
          z-index: 3;
          content: '';
          width: 100%;
          height: 10px;
          background-color: #F2F4F9;
        }

        &:before {
          top: 0;
          border-radius: 0 0 0 10px;
        }

        &:after {
          bottom: 0;
          border-radius: 10px 0 0 0;
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 80px;
    padding: 0 22px;
    box-sizing: border-box;
    border-top: 1px solid #eaeaea;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .start-btn {
        width: 98px;
        height: 42px;
        line-height: 42px;
        background: #0066ff;
        border-radius: 6px;
        color: #fff;
        margin-left: 33px;
        text-align: center;
        cursor: pointer;
      }

      .end-btn {
        color: #0066ff;
        line-height: 20px;
        cursor: pointer;
      }
    }

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .row {
        display: flex;
        align-items: center;
        color: #333333;
        margin-bottom: 7px;

        &:last-child {
          margin-bottom: 0;
        }

        .point {
          width: 5px;
          height: 5px;
          background: #00cba8;
          border-radius: 50%;
          margin-right: 6px;
        }

        &.disabled {
          color: #999999;

          .point {
            background: #c6c6c6;
          }
        }
      }
    }
  }
}
</style>
