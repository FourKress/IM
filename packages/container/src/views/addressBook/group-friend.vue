<template>
  <div class="group-friend">
    <div class="row">
      <div class="title">我创建的群聊（2）</div>
      <div class="list">
        <div class="item" v-for="item in myGroupList"
             :key="item.id"
             @click="handleJumpGroup">
          <div class="left">
            <img class="img" src="" alt="" />
            <div class="info">
              <span class="name">发送大</span>
              <span class="tips">sadjdja</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="title">我加入的群聊（2）</div>
      <div class="list">
        <div class="item" v-for="item in joinGroupList"
             :key="item.id"
             @click="handleJumpGroup">
          <div class="left">
            <img class="img" src="" alt="" />
            <div class="info">
              <span class="name">发送大</span>
              <span class="tips">sadjdja</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Group-Friend',
  data() {
    return {
      myGroupList: [{id: 1}, {id: 3}],
      joinGroupList: [{id: 21211}, {id: 333}]
    };
  },
  methods: {
    handleJumpGroup() {
      console.log(213321)
    }
  }
};
</script>

<style scoped lang="scss">
.group-friend {
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;

  .row {
    .title {
      font-size: 12px;
      color: $minor-text-color;
      margin: 20px 0 12px;
    }

    .list {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        box-sizing: border-box;
        height: 48px;
        background: $bg-white-color;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        margin-bottom: 16px;

        .left {
          display: flex;
          align-items: center;

          .img {
            display: block;
            width: 46px;
            height: 46px;
            border-radius: 6px;
          }

          .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding-left: 8px;

            .name {
              font-size: 14px;
              font-weight: bold;
              color: $main-text-color;
              margin-bottom: 5px;
            }

            .tips {
              font-size: 12px;
              color: $tips-text-color;
            }
          }
        }
      }
    }
  }
}
</style>
