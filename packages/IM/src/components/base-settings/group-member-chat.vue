<template>
  <div class="group-member-chat">
    <div class="title">创建群聊</div>
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
              v-model="staffName"
              placeholder="查找联系人"
            />
          </div>
        </div>
        <div
          class="active-row"
          v-if="panelType !== IMGroupMemberPanelType.isDel"
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
        <div class="list">
          <div class="scroll-view" v-if="staffList.length">
            <div
              class="item"
              :class="selectIndex === index && 'active'"
              v-for="(item, index) in staffList"
              v-if="item.nickname && item.nickname.includes(staffName)"
              @click="handleSelect(index)"
            >
              <el-checkbox v-model="item.checked">
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
      <div class="right">
        <div
          class="input-row"
          v-if="panelType === IMGroupMemberPanelType.isCreate"
        >
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
              v-model="groupName"
              placeholder="编辑群名称"
            />
          </div>
        </div>
        <div class="active-row" :style="{ marginTop: panelType !== IMGroupMemberPanelType.isCreate ? '10px' : '0' }">
          <span class="tips">
            <span>已选联系人：{{ selectList.length }}</span>
            <span v-if="panelType !== IMGroupMemberPanelType.isDel">/500</span>
          </span>
        </div>
        <div class="list">
          <div class="scroll-view" v-if="selectList.length">
            <div class="item" v-for="(item, index) in selectList">
              <div class="info">
                <div class="img">
                  <img :src="item.avatar" alt="" />
                </div>
                <div class="name">
                  <span>{{ item.nickname }}</span>
                </div>
              </div>
              <div class="close-icon" @click="handleUnSelect(item, index)">
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
          <span class="btn confirm" @click="handleConfirm">{{panelType !== IMGroupMemberPanelType.isDel ? '确定' : '删除'}} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { IMGroupMemberPanelType } from '@lanshu/utils';

const isAddress = false;

export default {
  name: 'Group-member-chat',
  props: {
    panelType: {
      required: true,
      type: String,
      default: IMGroupMemberPanelType.isCreate,
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      IMGroupMemberPanelType,
      isAddress,
      tabType: !isAddress,
      addressBookList: [],
      selfSessionList: [],
      selectList: [],
      selectIndex: 0,
      staffName: '',
      groupName: '',
    };
  },
  computed: {
    ...mapGetters('IMStore', ['sessionList']),
    staffList() {
      const staffList = this[this.currentTarget] || [];
      const sessionSelectList = this.selfSessionList
        ? this.selfSessionList?.filter((d) => d.checked)
        : [];
      const addressBookSelectList = this.addressBookList.filter(
        (d) => d.checked,
      );
      this.selectList = sessionSelectList.concat(addressBookSelectList);
      return staffList;
    },
    currentTarget() {
      if (this.tabType !== this.isAddress) return 'selfSessionList';
      return 'addressBookList';
    },
  },
  mounted() {
    this.selfSessionList = _.cloneDeep(this.sessionList).map((d) => {
      return {
        ...d,
        checked: false,
      };
    });
    this.addressBookList = new Array(20).fill('').map(() => {
      return {
        checked: false,
        avatar: '',
        nickname: String(Math.random()),
      };
    });
  },
  methods: {
    handleClean() {
      this.staffName = '';
      this.selectList = [];
      this.groupName = '';
    },
    handleClose() {
      this.$emit('close');
    },
    handleConfirm() {
      if (this.selectList?.length < 2) {
        this.$message.error('创建群聊至少选择2个联系人');
        return;
      }
      this.$emit('confirm');
    },
    handleClick(type) {
      this.tabType = type;
    },

    handleSelect(index) {
      this.selectIndex = index;
    },
    handleUnSelect(item, index) {
      this.selectList.splice(index, 1);
      const targetIndex = this.staffList.findIndex(
        (d) => d.nickname === item.nickname,
      );
      this[this.currentTarget][targetIndex].checked = false;
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
      padding: 10px 20px 0;

      .input-row {
        width: 242px;
        height: 36px;
        box-sizing: border-box;
        background-color: $bg-white-color;
        border-radius: 6px;
        padding: 0 14px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .query-icon {
          width: 14px;
          height: 14px;
          transform: translateY(-2px);
        }

        .input-panel {
          flex: 1;
          height: 20px;
          padding: 0 8px;
          font-size: 14px;

          ::v-deep .el-input {
            border: none;

            .el-input__inner {
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              padding: 0;
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

      ::-webkit-scrollbar {
        display: none;
      }

      .list {
        overflow-y: auto;
        overflow-x: hidden;
        transform: translate3d(0, 0, 0);

        .scroll-view {
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
                background-color: #333333;

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
              background-color: #333333;

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
