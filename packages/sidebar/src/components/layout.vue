<template>
  <div id="client-sidebar">
    <div class="sidebar-container">
      <div class="top">
        <div class="left">
          <span
            class="btn"
            :class="tabIndex === 1 && 'active'"
            @click="handleClick(1)"
          >
            待办
          </span>
          <span
            class="btn"
            :class="tabIndex === 2 && 'active'"
            @click="handleClick(2)"
          >
            完结
          </span>
        </div>
        <div class="right">
          <span class="query"></span>
          <span class="more"></span>
        </div>
      </div>

      <div class="sidebar-menu">
        <div
          class="menu-item"
          v-for="(item, index) in messageList"
          :class="messageIndex === index && 'active'"
          @click="handleMenuClick(index)"
        >
          <div class="img"></div>
          <div class="info">
            <div class="row">
              <span class="name">哈哈发哈哈</span>
              <span class="time">15:33</span>
            </div>
            <span class="message">阿萨斯大所大所大所大多啥所大所多</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainSidebar',
  data() {
    return {
      tabIndex: 1,
      messageIndex: 0,
      messageList: new Array(10).fill(''),
    };
  },
  components: {},
  methods: {
    handleClick(index) {
      this.tabIndex = index;
    },
    handleMenuClick(index) {
      this.messageIndex = index;
    },
  },
};
</script>

<style scoped lang="scss">
#client-sidebar {
  width: 265px;
  height: 100%;
  background-color: #fff;
  padding-bottom: 10px;
  box-sizing: border-box;

  ::-webkit-scrollbar {
    display: none;
  }

  .sidebar-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 10px 18px 20px;

      .left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        font-size: 16px;
        font-weight: bold;
        color: #777777;

        .btn {
          margin-left: 23px;
          cursor: pointer;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          line-height: 22px;

          transition: all 0.3s;

          &::after {
            content: '';
            width: 20px;
            height: 3px;
            background: #fff;
            border-radius: 3px;
            margin-top: 4px;
            transition: all 0.3s;
          }

          &:first-child {
            margin-left: 0;
          }

          &.active {
            color: #0066ff;

            &::after {
              background: #0066ff;
            }
          }
        }
      }

      .right {
        display: flex;
        align-items: center;

        .query,
        .more {
          width: 18px;
          height: 18px;
          cursor: pointer;

          background-color: #333333;
        }

        .query {
          margin-right: 17px;
        }
      }
    }

    .sidebar-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 10px;
      overflow-y: auto;
      transform: translate3d(0, 0, 0);

      .menu-item {
        width: 245px;
        height: 72px;
        border-radius: 6px;
        padding: 13px 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s;
        transform: translate3d(0, 0, 0);

        &.active,
        &:hover {
          background: #e9f2ff;
        }

        .img {
          width: 46px;
          height: 46px;
          background: #ffb100;
          border-radius: 6px;
          overflow: hidden;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          margin-left: 8px;

          .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            width: 100%;

            .name {
              font-size: 14px;
              font-weight: bold;
              color: #333333;
            }

            .time {
              font-size: 12px;
              font-weight: normal;
              color: #999999;
            }
          }

          .message {
            width: 145px;
            font-size: 12px;
            color: #999999;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
