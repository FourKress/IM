<template>
  <Card id="UserInfo-Card" title="个人信息">
    <div>
      <InfoBlock :info="{ title: '我的头像' }">
        <div class="avatar" @click="handleUploadFile">
          <img :src="userInfo.avatar" class="img" alt="" />
          <div class="tag"></div>
        </div>
      </InfoBlock>

      <template v-for="info in infos">
        <InfoBlock
          class="row"
          :key="info.key"
          :info="info"
        ></InfoBlock>
      </template>

      <input
        ref="fileInput"
        style="display: none"
        accept="image/*"
        id="file"
        type="file"
        name="file"
        @change="handleFileChange"
      />
    </div>
  </Card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { LsIcon } from '@lanshu/components';
import { IMSetUserProfile } from '@lanshu/im';
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
    ...mapGetters('IMStore', ['userInfo', 'userProfile']),
  },
  data() {
    return {
      nickname: '',
      avatar: '',
      avatarFile: null,
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
                maxlength="10"
                placeholder="编辑昵称…"
                onChange={(val) => this.handleNickNameChange(val)}
                v-model={target.value}
              />
            );
          },
        },
        {
          key: 'description',
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
          key: 'birthday',
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
                onChange={(val) => this.handleBirthdayChange(val)}
                type="date"
                placeholder="请选择生日"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
              ></el-date-picker>
            );
          },
        },
        {
          key: 'sex',
          title: '性別',
          label: '',
          value: '',
          btnText: '',
          render: (h, row) => {
            const target = this.infos.find((d) => d.key === row.key);
            return (
              <el-radio-group
                v-model={target.value}
                onChange={(val) => this.handleSexChange(val)}
              >
                <el-radio label={1}>男</el-radio>
                <el-radio label={2}>女</el-radio>
                <el-radio label={3}>未知</el-radio>
              </el-radio-group>
            );
          },
        },
        {
          key: 'location',
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
  watch: {
    userProfile: {
      deep: true,
      handler(val) {
        this.initData();
      },
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions('routerStore', ['addBreadCrumbs']),

    initData() {
      const { nickname, avatar } = this.userInfo;
      this.nickname = nickname;
      this.avatar = avatar;
      this.infos = this.infos.map((d) => {
        const value = this.userProfile[d.key];
        if (value) {
          d.value = value;
        }
        return {
          ...d,
        };
      });
    },

    handleUploadFile() {
      this.$refs.fileInput.value = '';
      this.$nextTick(() => {
        this.$refs.fileInput.click();
      });
    },
    handleFileChange(event) {
      const files = event?.target?.files;
      if (!files?.length) return;
      this.avatarFile = files[0];
      console.log(files)
    },

    handleNickNameChange(val) {
      console.log(val);
    },
    handleSignChange(val) {
      const {
        sex = '',
        birthday = '',
        location = '',
        phone = '',
      } = this.userProfile;
      IMSetUserProfile(val ? val : '', sex, birthday, location, phone);
    },
    handleBirthdayChange(val = '') {
      const {
        description = '',
        sex = '',
        location = '',
        phone = '',
      } = this.userProfile;
      IMSetUserProfile(description, sex, val ? val : '', location, phone);
    },
    handleSexChange(val) {
      const {
        description = '',
        birthday = '',
        location = '',
        phone = '',
      } = this.userProfile;
      IMSetUserProfile(description, val, birthday, location, phone);
    }
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
