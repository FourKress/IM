<template>
  <Card id='AccountCenter-Card' title="账号中心">
    <div>
      <div class='user-info'>
        <div class='avatar'>
          <img src='' class='img' alt=''>
          <div class='tag'></div>
        </div>
        <div class='nickname'>
          <el-input v-model='nickname'></el-input>
        </div>
      </div>

      <template v-for="(info, index) in infos">
        <InfoBlock
          :key="index"
          :info="info"
          @callback="handleCallback(info)"
        ></InfoBlock>
      </template>
    </div>
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'Account-Center',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      nickname: '打啊但是',
      infos: [
        {
          key: 'sign',
          title: '个性签名',
          label: '',
          value: '这是个性签名',
          btnText: '',
          render: (h, row) => {
            const target = this.infos.find(d => d.key === row.key);
            return (
              <el-input
                style="width: 300px;"
                type="text"
                placeholder="编辑个性签名…"
                onChange={(val) => this.handleChange(val)}
                v-model={target.value}
              />
            );
          },
        },
        {
          title: '手机号码',
          label: '已绑定号码',
          value: '18455555553',
          btnText: '更换',
        },
        {
          title: '实名认证',
          label: '已认证用户',
          value: '张三丰 500000000000000000',
          btnText: '',
        },
        {
          title: '绑定微信',
          label: '已绑定微信',
          value: 'zhangsanfeng',
          btnText: '解绑',
        },
        {
          title: '常用设备',
          label: '',
          value: '管理登录过北象的设备，并可对已登录的设备',
          btnText: '管理',
        },
        {
          title: '注销账号',
          label: '',
          value: '永久注销你的北象帐号，注销成功后该帐号将无法使用，帐号下的所有数据将被删除',
          btnText: '注销',
        },
      ],
    };
  },
  methods: {
    handleCallback(info) {
      console.log(info);
    },
    handleChange(val) {
      console.log(val);
    }
  },
};
</script>

<style scoped lang='scss'>
.user-info {
  margin-top: 26px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;

  .avatar {
    width: 50px;
    height: 50px;
    background: #D8D8D8;
    border-radius: 6px;
    position: relative;
    margin-right: 24px;

    .tag {
      width: 18px;
      height: 18px;
      position: absolute;
      right: -6px;
      bottom: -4px;
      border-radius: 50%;

      background-color: #333;
    }

    .img {
      width: 50px;
      height: 50px;
      background: #D8D8D8;
      border-radius: 6px;
      display: block;
    }
  }

  .nickname {
    margin-bottom: 7px;

    ::v-deep .el-input__inner {
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: unset;
      padding: 0;

      font-size: 16px;
      font-weight: bold;
      color: $main-text-color;
    }
  }
}
</style>
