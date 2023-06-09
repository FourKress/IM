<template>
  <div class="group-member-chat">
    <div class="title">{{ groupTitle }}</div>
    <div class="main">
      <div class="left">
        <div class="input-row">
          <div class="query-icon">
            <LsIcon
              icon="navi_ss_icon"
              width="14"
              height="14"
              render-svg
            ></LsIcon>
          </div>
          <div class="input-panel">
            <el-input
              type="text"
              clearable
              v-model="staffName"
              :placeholder="`查找${placeholder}`"
            />
          </div>
        </div>
        <div
          class="active-row"
          v-if="
            !(this.isDel || this.isDelAdmin || this.isAddAdmin) &&
            !(tabType === isAddress && staffName)
          "
        >
          <div class="action">
            <span
              class="btn"
              :class="tabType === !isAddress && 'active'"
              @click="handleClick(!isAddress)"
            >
              最近联系
            </span>
            <span
              class="btn"
              :class="tabType === isAddress && 'active'"
              @click="handleClick(isAddress)"
            >
              通讯录
            </span>
          </div>
        </div>
        <div class="py-nav" v-if="!staffName">
          <span
            v-if="tabType === isAddress"
            v-for="item in pyList"
            :key="item"
            :class="pinyinKey === item && 'active'"
            @click="filterAddress(item)"
          >
            {{ item }}
          </span>
        </div>
        <div class="list selected-scroll-view">
          <div
            class="scroll-view"
            v-if="tabType !== isAddress && selfSessionList.length"
          >
            <div
              class="item"
              :class="selectName === item.nickname && 'active'"
              v-for="item in selfSessionList"
              :key="item.nickname"
              v-if="item.nickname && item.nickname.includes(staffName)"
            >
              <el-checkbox
                v-model="item.checked"
                :disabled="item.isDefault"
                @change="(val) => handleSelect(val, item)"
              >
                <div class="info">
                  <div class="img">
                    <img :src="item.avatar" alt="" />
                  </div>
                  <div class="name">
                    <span>{{ item.nickname }}</span>
                  </div>
                </div>
              </el-checkbox>
            </div>
          </div>

          <div
            class="scroll-view"
            v-if="tabType === isAddress && addressBookList.length"
          >
            <div
              class="group-panel"
              :id="`group-${key}`"
              :key="key"
              v-for="(group, key) in addressBookPYObj"
            >
              <span class="group-name" v-if="!staffName">
                {{ key === isSpecial ? specialKey : key }}
              </span>

              <div
                class="item"
                :class="selectName === item.nickname && 'active'"
                v-for="item in group"
                v-if="item.nickname && item.nickname.includes(staffName)"
                :key="item.nickname"
              >
                <el-checkbox
                  v-model="item.checked"
                  :disabled="item.isDefault"
                  @change="(val) => handleSelect(val, item)"
                >
                  <div class="info">
                    <div class="img">
                      <img :src="item.avatar" alt="" />
                    </div>
                    <div class="name">
                      <span>{{ item.nickname }}</span>
                    </div>
                  </div>
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="input-row" v-if="isCreate">
          <div class="query-icon">
            <LsIcon
              icon="a-icon_bianjiqunmingcheng2x"
              width="14"
              height="14"
              render-svg
            ></LsIcon>
          </div>
          <div class="input-panel">
            <el-input
              type="text"
              v-model="groupName"
              clearable
              placeholder="编辑群名称"
            />
          </div>
        </div>
        <div
          class="active-row"
          :style="{
            marginTop:
              panelType !== IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE ? '10px' : '0',
          }"
        >
          <span class="tips">
            <span>已选{{ placeholder }}：{{ selectList.length }}</span>
            <span v-if="panelType !== IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL">
              /500
            </span>
          </span>
        </div>
        <div class="list">
          <div class="scroll-view" v-if="selectList.length">
            <div class="item" v-for="(item, index) in selectList" :key="index">
              <div class="info">
                <div class="img">
                  <img :src="item.avatar" alt="" />
                </div>
                <div class="name">
                  <span>{{ item.nickname }}</span>
                </div>
              </div>
              <div
                class="close-icon"
                v-if="!item.isDefault"
                @click="handleUnSelect(item, index)"
              >
                <LsIcon
                  icon="a-icon_close2x"
                  width="14"
                  height="14"
                  render-svg
                ></LsIcon>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-list">
          <span class="btn cancel" @click="handleClose">取消</span>
          <span class="btn confirm" @click="handleConfirm">
            {{
              panelType !== IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL ? '确定' : '删除'
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { mapActions } from 'vuex';
import {
  IM_GROUP_MEMBER_PANEL_TYPE,
  AddressBookMixins,
  lodash,
} from '@lanshu/utils';
import {
  IMAdminDelGroupMembers,
  IMCreateGroup,
  IMInviteMember,
  IMSetGroupMemberAdminRole,
} from '../../IM-SDK';

const isAddress = false;

export default {
  name: 'Group-member-chat',
  mixins: [AddressBookMixins],
  props: {
    panelType: {
      required: true,
      type: String,
      default: IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE,
    },
    defaultMembers: {
      type: Array,
      default: () => [],
    },
    rawMembers: {
      type: Array,
      default: () => [],
    },
    defaultGroup: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      IM_GROUP_MEMBER_PANEL_TYPE,
      isAddress,
      tabType: !isAddress,
      selfSessionList: [],
      selectList: [],
      selectName: null,
      staffName: '',
      groupName: '',
    };
  },
  computed: {
    groupTitle() {
      if (this.isDel) return '删除群成员';
      if (this.isAdd) return '添加群成员';
      if (this.isCreate) return '创建群聊';
      if (this.isAddAdmin) return '添加管理员';
      if (this.isDelAdmin) return '删除管理员';
    },
    isDel() {
      return this.panelType === this.IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL;
    },
    isAdd() {
      return this.panelType === this.IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD;
    },
    isCreate() {
      return this.panelType === this.IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE;
    },
    isAddAdmin() {
      return this.panelType === this.IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD_ADMIN;
    },
    isDelAdmin() {
      return this.panelType === this.IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL_ADMIN;
    },
    placeholder() {
      let str = '联系人';
      if (this.isDelAdmin || this.isAddAdmin) {
        str = '管理员';
      }
      if (this.isAdd || this.isDel) {
        str = '群成员';
      }
      return str;
    },
  },
  mounted() {
    this.selfSessionList = lodash.cloneDeep(this.rawMembers).map((d) => {
      return this.getCheckedStatus(d);
    });

    this.minScrollTop = 370;
    this.maxScrollTop = 440;

    if (!this.isCreate) {
      this.groupName = this.defaultGroup.nickname;

      if (this.defaultMembers.length) {
        if (this.isAddAdmin || this.isAdd) {
          this.selectList = [
            ...this.defaultMembers.map((d) => {
              d.isDefault = true;
              return d;
            }),
          ];
        }
      }
    }
  },
  methods: {
    ...mapActions('IMStore', [
      'setRefreshMembers',
      'setRefreshGroupRoleManager',
    ]),

    handleClose() {
      this.$emit('close');
    },
    async handleConfirm() {
      const handleMap = {
        [this.IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL]: {
          func: this.handleDelGroupMember,
          getList: () => this.selectList,
        },
        [this.IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD]: {
          func: this.handleAddGroupMember,
          getList: () => {
            return this.selectList.filter((d) => !d.isDefault);
          },
        },
        [this.IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE]: {
          func: this.handleCreateGroup,
          getList: () => this.selectList,
        },
        [this.IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD_ADMIN]: {
          func: this.handleAddGroupAdminMember,
          getList: () => {
            return this.selectList.filter((d) => !d.isDefault);
          },
        },
        [this.IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL_ADMIN]: {
          func: this.handleAddGroupAdminMember,
          getList: () => this.selectList,
        },
      };
      const handleTarget = handleMap[this.panelType];
      const realSelectList = handleTarget.getList();
      if (realSelectList?.length < 1) {
        this.$message.error(`${this.groupTitle}至少选择1人`);
        return;
      }
      if (!this.groupName && !(this.isAddAdmin || this.isDelAdmin)) {
        this.$message.error('请输入群聊名称');
        return;
      }
      const members = realSelectList.map((d) =>
        d.toUser ? d.toUser : d.userId,
      );
      console.log(
        members,
        realSelectList.map((d) => d.nickname),
      );

      const res = await handleTarget.func(members);
      this.$message.success(`${this.groupTitle}成功`);
      this.$emit('confirm', res?.data);
    },

    async handleCreateGroup(members) {
      // const avatar =
      //   'https://diy.jiuwa.net/make/ps?sktype=&fontsize=380&skwidth=3&fillcolor=022b6f&shadowtype=2&filltype=1&text=%E9%A9%AC&skcolor=999999&skopacity=1&distort=9&fontype=21';
      // groupAddType – 群加入类型 1：不允许加入2：任何人都可以加入3：群主或管理员审核通过后加入
      const groupAddType = 2;
      return await IMCreateGroup(this.groupName, '', groupAddType, members);
    },
    async handleAddGroupMember(members) {
      return await IMInviteMember(this.defaultGroup.toUser, members).then(
        () => {
          // 刷新群成员
          this.setRefreshMembers(Date.now());
        },
      );
    },
    async handleDelGroupMember(members) {
      return await IMAdminDelGroupMembers(
        this.defaultGroup.toUser,
        members,
      ).then(() => {
        // 刷新群成员
        this.setRefreshMembers(Date.now());
      });
    },
    async handleAddGroupAdminMember(members) {
      await Promise.all(
        members.map(async (d) => {
          await IMSetGroupMemberAdminRole(
            this.defaultGroup.toUser,
            d,
            this.isAddAdmin ? 2 : 1,
          );
        }),
      );
      // 刷新群管理列表
      this.setRefreshGroupRoleManager(Date.now());
    },

    async handleClick(type) {
      this.staffName = '';
      this.tabType = type;
      if (type === this.isAddress && !this.scrollView) {
        // 注册滚动事件的处理
        this.handleRegisterScroll();
        await this.getFriendListData();
        const addressBookList = this.addressBookList.map((d) => {
          d.toUser = d.userId;
          return this.getCheckedStatus(d);
        });
        this.addressBookList = addressBookList;
        this.initPinYin();
      }
    },

    handleSelect(value, item) {
      this.selectName = item?.nickname;
      if (value) {
        this.selectList.push(item);
      } else {
        this.selectList = this.selectList.filter(
          (d) => d.nickname !== item.nickname,
        );
      }
    },
    handleUnSelect(item, index) {
      this.selectList.splice(index, 1);
      if (this.tabType === isAddress) {
        Object.keys(this.addressBookPYObj).forEach((key) => {
          this.addressBookPYObj[key] = this.handleUnCheck(
            this.addressBookPYObj[key],
            item.nickname,
          );
        });
      } else {
        this.selfSessionList = this.handleUnCheck(
          this.selfSessionList,
          item.nickname,
        );
      }
    },
    handleUnCheck(arr, nickname) {
      return arr.map((d) => {
        return {
          ...d,
          checked: d.nickname === nickname ? false : d.checked,
        };
      });
    },

    getCheckedStatus(item) {
      const key = (this.isCreate || this.isAdd) ? 'toUser' : 'userId';
      const isDefault = this.defaultMembers.some((c) => c.userId === item[key]);
      const flag = this.isAdd || this.isAddAdmin ? isDefault : false;
      return {
        ...item,
        checked: flag,
        isDefault: flag,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.group-member-chat {
  width: 564px;
  height: 508px;
  display: flex;
  flex-direction: column;

  background: $bg-white-color;
  box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
  border-radius: 12px;
  border: 1px solid $split-line-color;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
    background-color: $bg-white-color;
    font-size: 16px;
    font-weight: bold;
    color: $main-text-color;
    box-sizing: border-box;
  }

  .main {
    flex: 1;
    height: calc(100% - 50px);
    border-top: 1px solid $split-line-color;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .left,
    .right {
      width: 50%;
      height: 456px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding-top: 10px;

      .input-row {
        width: 242px;
        height: 36px;
        box-sizing: border-box;
        background-color: $bg-white-color;
        border-radius: 6px;
        padding-left: 14px;
        margin: 0 auto 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        .query-icon {
          width: 14px;
          height: 14px;
          transform: translateY(-3px);
        }

        .input-panel {
          flex: 1;
          height: 40px;
          font-size: 14px;

          ::v-deep .el-input {
            border: none;
            height: 40px;

            .el-input__inner {
              height: 40px;
              border: none;
              outline: none;
              padding: 0 30px 0 8px;
            }
            input::placeholder {
              color: $tips-text-color;
              font-size: 14px;
            }
          }
        }
      }

      .active-row {
        width: 100%;
        height: 28px;
        line-height: 20px;
        margin-bottom: 20px;
        padding: 0 20px;
        box-sizing: border-box;

        .action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          font-size: 14px;
          color: $minor-text-color;

          .btn {
            margin-left: 20px;
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
              height: 2px;
              background: #f9fafc;
              border-radius: 1px;
              margin-top: 4px;
              transition: all 0.3s;
            }

            &:first-child {
              margin-left: 10px;
            }

            &.active {
              color: $primary-color;

              &::after {
                background: $primary-color;
              }
            }
          }
        }

        .tips {
          font-size: 14px;
          color: $minor-text-color;
        }
      }

      .list {
        flex: 1;
      }
    }

    .left {
      background: #f9fafc;
      padding-bottom: 20px;
      position: relative;

      ::-webkit-scrollbar {
        display: none;
      }

      .py-nav {
        width: 10px;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        position: absolute;
        color: $minor-text-color;
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          cursor: pointer;
          line-height: 13px;

          &.active {
            color: $primary-color;
            font-weight: bold;
          }
        }
      }

      .list {
        overflow-y: auto;
        overflow-x: hidden;
        transform: translate3d(0, 0, 0);
        scroll-behavior: smooth;

        .scroll-view {
          .group-panel {
            display: flex;
            flex-direction: column;

            .group-name {
              font-size: 12px;
              color: $tips-text-color;
              margin: 10px 0 0 10px;
            }
          }

          .item {
            width: 242px;
            height: 54px;
            border-radius: 6px;
            background-color: transparent;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
            cursor: pointer;

            &.active {
              background-color: $bg-hover-grey-color;
            }

            ::v-deep .el-checkbox {
              margin-left: 10px;
              display: flex;
              align-items: center;
              width: 100%;

              .el-checkbox__label {
                width: 100%;
              }
            }

            .info {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-start;

              .img {
                width: 34px;
                height: 34px;
                margin-right: 10px;
                border-radius: 6px;
                overflow: hidden;

                img {
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }

              .name {
                flex: 1;
                max-width: 166px;
                height: 22px;
                line-height: 22px;
                font-size: 14px;
                color: $main-text-color;

                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }

    .right {
      background-color: $bg-white-color;

      .input-row {
        background: #f9fafc;
      }

      ::v-deep .el-input {
        .el-input__inner {
          background: #f9fafc;
        }
      }

      .list {
        padding: 0 20px;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .scroll-view {
        .item {
          width: 242px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;

          .info {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .img {
              width: 34px;
              height: 34px;
              margin-right: 10px;
              border-radius: 6px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }

            .name {
              flex: 1;
              max-width: 166px;
              height: 22px;
              line-height: 22px;
              font-size: 14px;
              color: $main-text-color;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .close-icon {
            cursor: pointer;
          }
        }
      }

      .btn-list {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 20px;
        box-sizing: border-box;
        padding: 0 20px;

        .btn {
          width: 88px;
          height: 34px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 34px;
          text-align: center;
          margin-left: 10px;
          cursor: pointer;

          &.cancel {
            background-color: $bg-grey-color;
            color: $minor-text-color;
          }

          &.confirm {
            background-color: $primary-color;
            color: $bg-white-color;
          }
        }
      }
    }
  }
}
</style>
