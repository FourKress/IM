<template>
  <Card id="AccountCenter-Card" title="账号中心">
    <div>
      <div class="user-info">
        <div class="avatar">
          <img :src="userInfo.avatar" class="img" alt="" />
          <div class="tag"></div>
        </div>
        <div class="nickname">
          <el-input v-model="nickname"></el-input>
        </div>
      </div>

      <template v-for="info in infos">
        <InfoBlock
          :key="info.key"
          :info="info"
          @callback="handleCallback(info)"
        >
          <template slot="tag" v-if="info.key === 'authentication'">
            <span class="auth-tag">
              <LsIcon
                render-svg
                class='tag-icon'
                icon="a-icon_yzcg2x"
                height="12"
                width="12"
              ></LsIcon>
              <span>已实名</span>
            </span>
          </template>
        </InfoBlock>
      </template>
    </div>

    <LsCardDialog :visible.sync="showAuthenticate">
      <div class="auth-dialog-panel">
        <div class="auth-dialog-panel-top">提示</div>
        <div class="auth-dialog-panel-tips">
          请使用北象移动端扫码下方二维码，进行实名认证
        </div>
        <div class="auth-dialog-panel-content"></div>
        <div class="auth-dialog-panel-footer">
          <div class="confirm btn" @click="showAuthenticate = false">
            知道了
          </div>
        </div>
      </div>
    </LsCardDialog>

    <LsCardDialog :visible.sync="showUnbind">
      <div class="auth-dialog-panel">
        <div class="auth-dialog-panel-top">请使用需要绑定的微信扫描二维码</div>
        <div class="auth-dialog-panel-tips">绑定后可以使用微信扫描码登录</div>
        <div class="auth-dialog-panel-content"></div>
        <div class="auth-dialog-panel-footer">
          <div class="confirm btn" @click="showUnbind = false">知道了</div>
        </div>
      </div>
    </LsCardDialog>
  </Card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { LsCardDialog, LsIcon } from '@lanshu/components';
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'Account-Center',
  components: {
    Card,
    InfoBlock,
    LsCardDialog,
    LsIcon,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  data() {
    return {
      nickname: '',
      avatar: '',

      infos: [
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
          key: 'phoneNum',
          title: '手机号码',
          label: '已绑定号码',
          value: '18455555553',
          btnText: '更换',
          fnc: () => this.changePhone(),
        },
        {
          key: 'authentication',
          title: '实名认证',
          label: '已认证用户',
          value: '张三丰 500000000000000000',
          btnText: '去认证',
          fnc: (info) => this.authenticate(info),
        },
        {
          key: 'binding',
          title: '绑定微信',
          label: '已绑定微信',
          value: 'zhangsanfeng',
          btnText: '解绑',
          fnc: (info) => this.unbind(info),
        },
        {
          key: 'device',
          title: '常用设备',
          label: '',
          value: '管理登录过北象的设备，并可对已登录的设备',
          btnText: '管理',
          fnc: () => this.jumpDevices(),
        },
        {
          key: 'cancel',
          title: '注销账号',
          label: '',
          value:
            '永久注销你的北象帐号，注销成功后该帐号将无法使用，帐号下的所有数据将被删除',
          btnText: '注销',
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
    handleChange(val) {
      console.log(val);
    },
    changePhone() {
      this.$Lconfirm({
        title: '确定要更换手机号码？',
        render: () => (
          <span>
            修改成功后，你需要使用新
            <br />
            手机号码登录
          </span>
        ),
      }).then(() => {
        const path = '/settings/changePhoneNum';
        this.addBreadCrumbs({
          title: '更换手机号',
          path,
        });
        this.$router.push(path);
      }).catch(e => {});
    },
    authenticate() {
      this.showAuthenticate = true;
    },
    unbind(info) {
      console.log(info);
      if (info.value) {
        this.$Lconfirm({
          title: '确定要解绑微信吗？',
          content: '解绑后将不能使用微信登录',
        }).then(() => {
          console.log('312123231123');
        }).catch(e => {});
      } else {
        this.showUnbind = true;
      }
    },
    jumpDevices() {
      const path = '/settings/devices';
      this.addBreadCrumbs({
        title: '常用设备',
        path,
      });
      this.$router.push(path);
    },
  },
};
</script>

<style scoped lang="scss">
.user-info {
  margin-top: 26px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;

  .avatar {
    width: 50px;
    height: 50px;
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
      background: #d8d8d8;
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

.auth-tag {
  margin-left: 10px;
  font-weight: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 53px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid $minor-color;
  text-align: center;
  font-size: 11px;
  color: $minor-color;
  line-height: 18px;

  .tag-icon {
    margin-right: 2px;
  }
}

.auth-dialog-panel {
  width: 372px;
  height: 427px;
  background: $bg-white-color;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border-radius: 12px;
  border: 1px solid $split-line-color;
  box-sizing: border-box;
  padding: 40px 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  &-top {
    width: 100%;
    height: 27px;
    line-height: 27px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: $main-text-color;
  }

  &-tips {
    width: 100%;
    height: 27px;
    line-height: 27px;
    text-align: center;
    font-size: 14px;
    color: $tips-text-color;
    margin: 26px 0 40px;
  }

  &-content {
    width: 160px;
    height: 160px;
    margin: 0 auto;

    background-color: #333333;
  }

  &-footer {
    width: 100%;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px auto;

    .btn {
      width: 88px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      background: $primary-color;
      border-radius: 6px;
      margin: 0 5px;

      &.confirm {
        color: $bg-white-color;
      }
    }
  }
}
</style>
