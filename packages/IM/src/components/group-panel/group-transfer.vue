<template>
  <div class='group-transfer' v-if="visibleDrawer">
    <Drawer title="转移群主" @close="handleCloseDrawer">
      <div class='content'>
        <el-radio-group v-model="selectUserId">
          <div
            class="item"
            v-for="(item, index) in members"
            :key='index'
          >
            <el-radio :label="item.userId">
              <div class="info">
                <div class="img">
                  <img :src="item.avatar" alt="" />
                </div>
                <div class="name">
                  <span>{{ item.nickname }}</span>
                </div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>

        <div class='btn' @click="handleConfirm">确定</div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import DrawerMixins from './drawer-mixins';
import {IMGetGroupMemberList} from "../../IM-SDK";
import {mapGetters} from "vuex";

export default {
  name: 'Transfer-group',
  mixins: [DrawerMixins],
  data() {
    return {
      nextSeq: 0,
      members: [],
      selectUserId: '',
    }
  },
  computed: {
    ...mapGetters('IMStore', [
      'userInfo',
      'actionWindow',
      'refreshMembers',
    ]),
    groupId() {
      return this.actionWindow.toUser;
    },
  },
  watch: {
    refreshMembers() {
      this.getGroupMemberList();
    },
  },
  mounted() {
    this.getGroupMemberList();
  },
  methods: {
    getGroupMemberList() {
      // nextSeq默认从0开始
      IMGetGroupMemberList(this.groupId, 0).then((res) => {
        console.log(res, 'getGroupMemberList');
        const { nextSeq, members = [] } = res;
        this.nextSeq = nextSeq;
        this.members = members.filter(d => d.userId !== this.userInfo.userId).map(d => {
          return {
            ...d,
            checked: false,
          }
        });
      });
    },
    handleConfirm() {
      if (!this.selectUserId) return
      this.$emit('confirm', this.selectUserId)
      this.handleCloseDrawer();
    }
  }
};
</script>

<style scoped lang='scss'>
.group-transfer {
  ::v-deep .el-drawer__body {
    display: flex;

  }

  .content {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;

    .btn {
      position: absolute;
      right: 20px;
      bottom: 10px;

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
      color: $bg-white-color;
    }
  }

}


.item {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  margin: 34px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ::v-deep .el-radio {
    display: flex;
    align-items: center;
  }

  .info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .img {
      width: 40px;
      height: 40px;
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
      max-width: 180px;
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
</style>
