<template>
  <Card id="UserInfo-Card" title="个人信息">
    <div>
      <InfoBlock :info="{ title: '我的头像' }">
        <div class="avatar">
          <img :src="userInfo.avatar" class="img" alt="" />
          <div class="tag"></div>
        </div>
      </InfoBlock>

      <template v-for="info in infos">
        <InfoBlock
          class="row"
          :key="info.key"
          :info="info"
          @callback="handleCallback(info)"
        ></InfoBlock>
      </template>
    </div>
  </Card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { LsIcon } from '@lanshu/components';
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'User-Info',
  components: {
    Card,
    InfoBlock,
    LsIcon,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  data() {
    return {
      nickname: '',
      avatar: '',
      addressOptions: [
        {
          value: 1,
          label: 123,
          children: [
            { value: 2, label: 444, children: [{ value: 12333, label: 23 }] },
          ],
        },
      ],
      infos: [
        {
          key: 'nickname',
          title: '昵称',
          label: '',
          value: '武清区五千万',
          btnText: '',
          render: (h, row) => {
            const target = this.infos.find((d) => d.key === row.key);
            return (
              <el-input
                type="text"
                clearable
                placeholder="编辑昵称…"
                onChange={(val) => this.handleNickNameChange(val)}
                v-model={target.value}
              />
            );
          },
        },
        {
          key: 'sign',
          title: '个性签名',
          label: '',
          value: '这是个性签名',
          btnText: '',
          render: (h, row) => {
            const target = this.infos.find((d) => d.key === row.key);
            return (
              <el-input
                type="text"
                clearable
                placeholder="编辑个性签名…"
                onChange={(val) => this.handleSignChange(val)}
                v-model={target.value}
              />
            );
          },
        },
        {
          key: 'date',
          title: '生日',
          label: '',
          value: '',
          btnText: '',
          render: (h, row) => {
            const target = this.infos.find((d) => d.key === row.key);
            return (
              <el-date-picker
                clearable
                v-model={target.value}
                type="date"
                placeholder="请选择生日"
              ></el-date-picker>
            );
          },
        },
        {
          key: 'address',
          title: '所在地',
          label: '',
          value: '',
          btnText: '',
          render: (h, row) => {
            const target = this.infos.find((d) => d.key === row.key);
            return (
              <el-cascader
                clearable
                v-model={target.value}
                options={this.addressOptions}
                placeholder="请选择所在地"
              ></el-cascader>
            );
          },
        },
      ],
      showAuthenticate: false,
      showUnbind: false,
    };
  },
  mounted() {
    const { nickname, avatar } = this.userInfo;
    this.nickname = nickname;
    this.avatar = avatar;
  },
  methods: {
    ...mapActions('routerStore', ['addBreadCrumbs']),
    handleCallback(info) {
      if (info?.fnc) {
        info.fnc(info);
      }
    },
    handleNickNameChange(val) {
      console.log(val);
    },
    handleSignChange(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped lang="scss">
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  position: relative;
  cursor: pointer;

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
    background: #d8d8d8;
    border-radius: 6px;
    display: block;
  }
}

.row {
  width: 486px;

  ::v-deep .el-cascader {
    width: 100%;
  }

  ::v-deep .el-input {
    width: 100%;
  }
}
</style>
