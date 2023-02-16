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
              clearable
              v-model="staffName"
              placeholder="查找联系人"
            />
          </div>
        </div>
        <div
          class="active-row"
          v-if="panelType !== IMGroupMemberPanelType.isDel && !(tabType === isAddress && staffName)"
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
              <span class="group-name" v-if="!staffName">{{ key === 'special' ? '#' : key }}</span>

              <div
                class="item"
                :class="selectName === item.nickname && 'active'"
                v-for="item in group"
                v-if="item.nickname && item.nickname.includes(staffName)"
                :key="item.nickname"
              >
                <el-checkbox
                  v-model="item.checked"
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
        <div
          class="input-row"
          v-if="panelType === IMGroupMemberPanelType.isCreate"
        >
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
              panelType !== IMGroupMemberPanelType.isCreate ? '10px' : '0',
          }"
        >
          <span class="tips">
            <span>已选联系人：{{ selectList.length }}</span>
            <span v-if="panelType !== IMGroupMemberPanelType.isDel">/500</span>
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
          <span class="btn confirm" @click="handleConfirm">
            {{ panelType !== IMGroupMemberPanelType.isDel ? '确定' : '删除' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { IMGroupMemberPanelType, sortedPY, groupedPy } from '@lanshu/utils';

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
      addressBookList: [
        { nickname: '张三' },
        { nickname: '李四' },
        { nickname: '王五' },
        { nickname: '2' },
        { nickname: '3' },
        { nickname: '4' },
        { nickname: 'a' },
        { nickname: 'b' },
        { nickname: 'c' },
        { nickname: '!' },
        { nickname: '@' },
        { nickname: '#' },
        { nickname: '赵六' },
        { nickname: '钱七' },
        { nickname: '钱1' },
        { nickname: '钱2' },
        { nickname: '钱3' },
        { nickname: '钱4' },
        { nickname: '钱5' },
        { nickname: '钱6' },
        { nickname: '东7' },
        { nickname: '东1' },
        { nickname: '东2' },
        { nickname: '东3' },
        { nickname: '东4' },
        { nickname: '东5' },
        { nickname: '东6' },
      ],
      addressBookPYObj: [],
      selfSessionList: [],
      selectList: [],
      selectName: null,
      staffName: '',
      groupName: '',
      pinyinKey: 'A',
      scrollView: null,
      scrollTop: 0,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['sessionList']),
    pyList() {
      const wordArr = [];
      const keys = Object.keys(this.addressBookPYObj);
      for (let i = 65; i <= 90; i++) {
        const code = String.fromCharCode(i);
        if (keys.includes(code)) {
          wordArr.push(code);
        }
      }
      return wordArr?.length ? [...wordArr, '#'] : wordArr;
    },
  },
  mounted() {
    this.selfSessionList = _.cloneDeep(this.sessionList).map((d) => {
      return {
        ...d,
        checked: false,
      };
    });
    const addressBookList = this.addressBookList.map((d) => {
      return {
        ...d,
        checked: false,
        avatar: '',
      };
    });
    this.addressBookList = addressBookList;
    const addressBookPYObj = groupedPy(sortedPY(addressBookList));
    this.pinyinKey = Object.keys(addressBookPYObj)[0];
    this.addressBookPYObj = addressBookPYObj;
  },
  methods: {
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
      this.staffName = '';
      this.tabType = type;
      if (type === this.isAddress && !this.scrollView) {
        this.$nextTick(() => {
          this.scrollView = document.querySelector('.selected-scroll-view');
          this.scrollView.addEventListener('scroll', this.scrollHandle, true);
        });
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

    filterAddress(key) {
      setTimeout(() => {
        this.pinyinKey = key;
      }, 100)
      document.querySelector(`#group-${key === '#' ? 'special' : key}`).scrollIntoView();
    },

    scrollHandle() {
      const scrollView = document.querySelector('.selected-scroll-view');
      const { scrollTop } = scrollView;
      const isDown = this.scrollTop <= scrollTop;
      this.scrollTop = scrollTop;
      Object.keys(this.addressBookPYObj).forEach((key) => {
        const pinyinKey = key === 'special' ? '#' : key;
        const offset = document
          .querySelector(`#group-${key}`)
          .getBoundingClientRect();

        const { top, height } = offset;

        if (isDown && top <= 235) {
          this.$nextTick(() => {
            this.pinyinKey = pinyinKey;
          });
          return;
        }

        if (
          !isDown &&
          ((top < 0 && top * -1 <= (height - 235) / 3) ||
            (top >= 170 && top <= 235))
        ) {
          this.$nextTick(() => {
            this.pinyinKey = pinyinKey;
          });
        }
      });
    },
  },
  destroyed() {
    if (this.scrollView) {
      this.scrollView.removeEventListener('scroll', this.scrollHandle, true);
    }
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
        padding-left: 14px;
        margin-bottom: 10px;
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
