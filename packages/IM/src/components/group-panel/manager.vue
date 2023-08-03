<template>
  <div class="manager" v-if="visibleDrawer">
    <Drawer title="群管理" @close="handleCloseDrawer">
      <div class="drawer-content">
        <div class="tips" v-if="groupRole === GROUP_ROLE_TYPE.IS_OWNER">
          共{{ groupAdminList.length }}位管理员
        </div>

        <div class="action">
          <span
            class="item"
            v-for="item in groupAdminList"
            @click="(event) => handleFriend(item, event)"
          >
            <el-tooltip effect="dark" :content="item.nickname" placement="top">
              <img class="img" :src="item.avatar" alt="" />
            </el-tooltip>
          </span>

          <span
            class="btn item"
            v-if="groupRole === GROUP_ROLE_TYPE.IS_OWNER"
            @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD_ADMIN)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="navi_ss_add"
            ></LsIcon>
          </span>
          <span
            class="btn item"
            v-if="
              groupAdminList.length && groupRole === GROUP_ROLE_TYPE.IS_OWNER
            "
            @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL_ADMIN)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="a-icon_jianhao2x"
            ></LsIcon>
          </span>
        </div>

        <div class="row">
          <RowChat title="谁可以编辑群信息">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="
                isDisabled || groupRoleManager.whoCanSetGroupInfo > groupRole
              "
              v-model="groupRoleManager.whoCanSetGroupInfo"
              @change="
                (val) => handleGroupRoleChange(val, 'whoCanSetGroupInfo')
              "
            >
              <el-option
                v-for="(opt, i) in options"
                :key="i"
                :disabled="opt.value > groupRole"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </RowChat>
          <RowChat title="谁可以添加群成员">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="
                isDisabled ||
                groupRoleManager.whoCanAddGroupMemberOrShareGroup > groupRole
              "
              v-model="groupRoleManager.whoCanAddGroupMemberOrShareGroup"
              @change="
                (val) =>
                  handleGroupRoleChange(val, 'whoCanAddGroupMemberOrShareGroup')
              "
            >
              <el-option
                v-for="(opt, i) in options"
                :key="i"
                :disabled="opt.value > groupRole"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </RowChat>

          <RowChat title="谁可以在本群发言">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="
                isDisabled || groupRoleManager.whoCanSendMessage > groupRole
              "
              v-model="groupRoleManager.whoCanSendMessage"
              @change="(val) => handleGroupRoleChange(val, 'whoCanSendMessage')"
            >
              <el-option
                v-for="(opt, i) in options"
                :key="i"
                :disabled="opt.value > groupRole"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </RowChat>
          <RowChat title="谁可以发起语音、视频通话">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="
                isDisabled ||
                groupRoleManager.whoCanStartNetworkCall > groupRole
              "
              v-model="groupRoleManager.whoCanStartNetworkCall"
              @change="
                (val) => handleGroupRoleChange(val, 'whoCanStartNetworkCall')
              "
            >
              <el-option
                v-for="(opt, i) in options"
                :key="i"
                :disabled="opt.value > groupRole"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </RowChat>

          <RowChat title="谁可以发送文件">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="
                isDisabled || groupRoleManager.whoCanSendFile > groupRole
              "
              v-model="groupRoleManager.whoCanSendFile"
              @change="(val) => handleGroupRoleChange(val, 'whoCanSendFile')"
            >
              <el-option
                v-for="(opt, i) in options"
                :key="i"
                :disabled="opt.value > groupRole"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </RowChat>
          <!--          <RowChat title="谁可以@所有人">-->
          <!--            <el-select-->
          <!--              placeholder="请选择"-->
          <!--              size="small"-->
          <!--              v-model="groupRoleManager.whoCanAtAll"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="(opt, i) in options"-->
          <!--                :key="i"-->
          <!--                :label="opt.label"-->
          <!--                :value="opt.value"-->
          <!--              ></el-option>-->
          <!--            </el-select>-->
          <!--          </RowChat>-->
        </div>

        <!--        <div class="row">-->
        <!--          <RowChat title="谁可以收到进群通知">-->
        <!--            <el-select placeholder="请选择" size="small"></el-select>-->
        <!--          </RowChat>-->
        <!--          <RowChat title="谁可以收到退群通知">-->
        <!--            <el-select placeholder="请选择" size="small"></el-select>-->
        <!--          </RowChat>-->
        <!--        </div>-->

        <!--        <div class="row">-->
        <!--          <RowChat title="进群验证" label="阿斯达四大大所">-->
        <!--            <span slot="right-btn" class="check-btn">-->
        <!--              <el-switch-->
        <!--                slot="right-btn"-->
        <!--                v-model="value"-->
        <!--                active-color="#0066FF"-->
        <!--                inactive-color="#C9CDD4"-->
        <!--              ></el-switch>-->
        <!--            </span>-->
        <!--          </RowChat>-->
        <!--        </div>-->

        <div class="row" v-if="groupRole === GROUP_ROLE_TYPE.IS_OWNER">
          <!--                  <RowChat-->
          <!--                    label="查看进退群记录"-->
          <!--                    @callback="openGroupRecord"-->
          <!--                    show-right-btn-->
          <!--                  />-->
          <RowChat
            label="转让群主"
            @callback="openGroupTransfer"
            show-right-btn
          />
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { GROUP_ROLE_TYPE, IM_GROUP_MEMBER_PANEL_TYPE } from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import {
  IMGetAllAdminList,
  IMGetGroupRoleManagerList,
  IMSetGroupRoleManagerList,
  IMGetGroupMemberList,
} from '../../IM-SDK';
import RowChat from './row-chat';
import DrawerMixins from './drawer-mixins';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'manager',
  mixins: [DrawerMixins],
  props: {
    groupRole: {
      type: Number,
      default: -1,
    },
  },
  components: {
    LsIcon,
    RowChat,
  },
  data() {
    return {
      IM_GROUP_MEMBER_PANEL_TYPE,
      GROUP_ROLE_TYPE,
      options: [
        {
          label: '所有群成员',
          value: 1,
        },
        {
          label: '仅群主和管理员',
          value: 2,
        },
        {
          label: '仅群主',
          value: 3,
        },
      ],
      value: true,

      groupRoleManager: {},
      groupAdminList: [],
      members: [],
    };
  },
  computed: {
    ...mapGetters('IMStore', [
      'actionWindow',
      'refreshGroupRoleManager',
      'userInfo',
    ]),

    isDisabled() {
      return ![GROUP_ROLE_TYPE.IS_OWNER, GROUP_ROLE_TYPE.IS_MANAGE].includes(
        this.groupRole,
      );
    },
  },
  watch: {
    refreshGroupRoleManager() {
      this.initData();
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions('IMStore', ['setRefreshGroupRoleManager']),

    initData() {
      this.getAllAdminList();
      this.getGroupMemberList();
      this.getGroupRoleManagerList();
    },

    getGroupMemberList() {
      // nextSeq默认从0开始
      IMGetGroupMemberList(this.actionWindow.toUser, 0).then((res) => {
        console.log(res, 'getGroupMemberList');
        const { nextSeq, members = [] } = res;
        this.nextSeq = nextSeq;
        this.members = members
          .filter((d) => d.userId !== this.userInfo.userId)
          .map((d) => {
            return {
              ...d,
              nickname: d.alias || d.nickname,
            };
          });
      });
    },

    getAllAdminList() {
      IMGetAllAdminList(this.actionWindow.toUser)
        .then((res) => {
          console.log(res.data);
          this.groupAdminList = res?.data || {};
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getGroupRoleManagerList() {
      IMGetGroupRoleManagerList(this.actionWindow.toUser)
        .then((res) => {
          console.log(res.data);
          this.groupRoleManager = res?.data || {};
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // openGroupRecord() {
    //   this.$emit('groupRecord');
    // },
    openGroupTransfer() {
      this.$emit('groupTransfer');
    },
    handleGroupRoleChange(val, key) {
      this.groupRoleManager[key] = val;
      const {
        whoCanSetGroupInfo,
        whoCanAddGroupMemberOrShareGroup,
        whoCanStartNetworkCall,
        whoCanSendMessage,
        whoCanSendFile,
        whoCanAtAll,
      } = this.groupRoleManager;
      IMSetGroupRoleManagerList(
        this.actionWindow.toUser,
        whoCanSetGroupInfo,
        whoCanAddGroupMemberOrShareGroup,
        whoCanStartNetworkCall,
        whoCanSendMessage,
        whoCanSendFile,
        whoCanAtAll,
      ).then(() => {
        this.setRefreshGroupRoleManager(Date.now());
      });
    },

    changeMember(type) {
      this.$emit('changeGroupMember', {
        type,
        defaultMembers: this.groupAdminList,
        members:
          type === IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL_ADMIN
            ? this.groupAdminList
            : this.members,
      });
    },

    handleFriend(member, event) {
      this.$emit('checkMember', member, event);
    },
  },
};
</script>

<style scoped lang="scss">
.manager {
  .drawer-content {
    padding: 0 20px;

    .tips {
      margin: 20px 0;
      font-size: 14px;
      color: $minor-text-color;
    }

    .action {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;

      .item,
      .btn {
        width: 35px;
        height: 35px;
        margin: 0 10px 10px 0;
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        cursor: pointer;
      }

      .item {
        &:nth-child(6n + 6) {
          margin-right: 0;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .btn {
        background: $bg-white-color;
        border: 1px dashed $split-line-color;
      }
    }
  }

  .check-btn {
    width: 28px;
    height: 16px;

    ::v-deep {
      .el-switch {
        transform-origin: center;
        transform: scale(0.8) translate(-7px, -6px);
      }
    }
  }
}
</style>
