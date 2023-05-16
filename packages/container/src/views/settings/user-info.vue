<template>
  <Card id="UserInfo-Card" title="个人信息">
    <div>
      <InfoBlock :info="{ title: '我的头像' }">
        <div class="avatar" @click="handleUploadFile">
          <img :src="userProfile.avatar" class="img" alt="" />
          <div class="tag">
            <LsIcon
              class=""
              size="10"
              icon="ls-icon-a-icon_genghuantouxiang2x"
            ></LsIcon>
          </div>
        </div>
      </InfoBlock>

      <template v-for="info in infos">
        <InfoBlock class="row" :key="info.key" :info="info"></InfoBlock>
      </template>

      <InfoBlock class="row">
        <el-cascader
          clearable
          v-model="regions"
          @change="handleRegionsChange"
          :props="this.selectProps"
          :options="selectOptions"
          placeholder="请选择所在地"
        ></el-cascader>
      </InfoBlock>

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
import { IMSetUserProfile, IMGetUserProfile } from '@lanshu/im';
import { Apis, getToken, TOKEN_TYPE } from '@lanshu/utils';
import Card from './card';
import InfoBlock from './info-block';
import { renderProcess } from '@lanshu/render-process';

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
      infos: [
        {
          key: 'nickname',
          title: '昵称',
          label: '',
          value: '',
          btnText: '',
          render: (h, row) => {
            const target = this.infos.find((d) => d.key === row.key);
            return (
              <el-input
                type="text"
                clearable
                maxlength="10"
                placeholder="编辑昵称…"
                onChange={(val) =>
                  this.handleAvatarAndNickNameChange('nickName', val)
                }
                v-model={target.value}
              />
            );
          },
        },
        {
          key: 'description',
          title: '个性签名',
          label: '',
          value: '',
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
      ],
      selectOptions: [],
      selectProps: {
        value: 'code',
        label: 'name',
        children: 'subRegions',
      },
      showAuthenticate: false,
      showUnbind: false,
      terminal: '',
      regions: [],
    };
  },
  watch: {
    userProfile: {
      deep: true,
      handler() {
        this.initData();
      },
    },
  },
  async mounted() {
    this.terminal = await renderProcess.getStore('CLIENT_TERMINAL');
    this.initData();
    await this.getRegion();
  },
  methods: {
    ...mapActions('routerStore', ['addBreadCrumbs']),
    ...mapActions('IMStore', ['setUserProfile', 'setUserInfo']),

    initData() {
      const { location } = this.userProfile;
      this.regions = location ? location.split(',') : [];
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
      const avatarFile = files[0];
      const formData = new FormData();
      formData.append('file', avatarFile);
      Apis.managerFileUpload(formData)
        .then((res) => {
          const url = res?.data?.url;
          this.handleAvatarAndNickNameChange('picture', url);
        })
        .catch((error) => {
          this.$message.error('头像上传失败!');
        });
    },

    async getRegion() {
      const res = await Apis.managerRegionQueryAsTree();
      this.selectOptions = res?.data?.subRegions || [];
    },

    handleRegionsChange(val) {
      const regions = val.join(',');
      const {
        description = '',
        sex = '',
        birthday = '',
        phone = '',
      } = this.userProfile;
      this.handleUserProfile([
        description,
        sex,
        birthday,
        val ? regions : '',
        phone,
      ]);
    },

    async handleAvatarAndNickNameChange(key, val) {
      const { avatar, nickname } = this.userProfile;
      const params = {
        picture: avatar,
        nickName: nickname,
        terminal: this.terminal,
        token: getToken(TOKEN_TYPE.IS_SYS),
      };
      params[key] = val;
      await Apis.accountUpdateUserInfo(params);
      const res = await IMGetUserProfile(this.userProfile.userId);
      const userProfile = res?.data || {};
      await this.setUserInfo({
        ...this.userInfo,
        nickname: userProfile?.nickname,
        avatar: userProfile?.avatar,
      });
      await this.setUserProfile(userProfile);
    },

    async handleUserProfile(params) {
      const res = await IMSetUserProfile(...params);
      console.log(res.data);
      await this.setUserProfile(res.data);
    },

    handleSignChange(val) {
      const {
        sex = '',
        birthday = '',
        location = '',
        phone = '',
      } = this.userProfile;
      this.handleUserProfile([val ? val : '', sex, birthday, location, phone]);
    },
    handleBirthdayChange(val = '') {
      const {
        description = '',
        sex = '',
        location = '',
        phone = '',
      } = this.userProfile;
      this.handleUserProfile([
        description,
        sex,
        val ? val : '',
        location,
        phone,
      ]);
    },
    handleSexChange(val) {
      const {
        description = '',
        birthday = '',
        location = '',
        phone = '',
      } = this.userProfile;
      this.handleUserProfile([description, val, birthday, location, phone]);
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
    color: $minor-text-color;
    background: $bg-white-color;
    box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.05);
    border: 1px solid $split-line-color;
    position: absolute;
    right: -6px;
    bottom: -4px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .img {
    width: 50px;
    height: 50px;
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
