<template>
  <div v-if="visibleDrawer">
    <Drawer title="进退群记录" @close="handleCloseDrawer">
      <div class="record-content">
        <div class="record-item" v-for="item in list" :key='index'>
          <div class="img">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="info">
            <div class="row">
              <span class="name">{{ item.nickname }}的手动阀</span>
              <span class="time">
                <TimesTransform :timestamp="item.timestamp" />
                2022/12/12
              </span>
            </div>
            <div class="msg-row">
              <span class="message">
                扫码
                <span class="link">@张三丰</span>
                加入群聊
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import DrawerMixins from './drawer-mixins';

export default {
  name: 'Record',
  mixins: [DrawerMixins],
  data() {
    return {
      list: [{}, {}, {}],
    };
  },
};
</script>

<style scoped lang="scss">
.record-content {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.record-item {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  margin: 34px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .img {
    width: 40px;
    height: 40px;
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
    margin-left: 11px;

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      width: 100%;

      .name {
        height: 20px;
        width: 140px;
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-weight: bold;
        color: $main-text-color;
      }

      .time {
        font-size: 12px;
        font-weight: normal;
        color: $tips-text-color;
      }
    }

    .msg-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      .message {
        width: 180px;
        font-size: 14px;
        color: $minor-text-color;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .link {
          color: $primary-color;
        }
      }
    }
  }
}
</style>
