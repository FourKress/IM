<template>
  <div class="manager" v-if="visible">
    <Drawer title="群管理" @close="handleCloseDrawer">
      <div class="drawer-content">
        <div class="tips">共40位成员</div>

        <div class="action">
          <span
            class="add btn"
            @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="navi_ss_add"
            ></LsIcon>
          </span>
          <span
            class="add btn"
            @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="navi_ss_add"
            ></LsIcon>
          </span>

          <span
            class="add btn"
            @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="navi_ss_add"
            ></LsIcon>
          </span>
          <span
            class="del btn"
            @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL)"
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
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>
          <RowChat title="谁可以添加群成员、分享群">
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>

          <RowChat title="谁可以在本群发言">
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>
          <RowChat title="谁可以发起语音、视频通话">
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>

          <RowChat title="谁可以发送文件">
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>
          <RowChat title="谁可以@所有人">
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>
        </div>

        <div class="row">
          <RowChat title="谁可以收到进群通知">
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>
          <RowChat title="谁可以收到退群通知">
            <el-select placeholder="请选择" size="small"></el-select>
          </RowChat>
        </div>

        <div class="row">
          <RowChat title="进群验证" label="阿斯达四大大所">
            <span slot="right-btn" class="check-btn">
              <el-switch
                slot="right-btn"
                v-model="value"
                active-color="#0066FF"
                inactive-color="#C9CDD4"
              ></el-switch>
            </span>
          </RowChat>
        </div>

        <div class="row">
          <RowChat
            label="查看进退群记录"
            @callback="openGroupRecord"
            show-right-btn
          />
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
import { IM_GROUP_MEMBER_PANEL_TYPE } from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import { IMGetGroupRoleManagerList } from '../../IM-SDK';
import RowChat from './row-chat';
import DrawerMixins from './drawer-mixins';
import { mapGetters } from 'vuex';

export default {
  name: 'manager',
  mixins: [DrawerMixins],
  components: {
    LsIcon,
    RowChat,
  },
  data() {
    return {
      value: true,
      IM_GROUP_MEMBER_PANEL_TYPE,
      groupRoleManagerInfo: {},
    };
  },
  computed: {
    ...mapGetters('IMStore', ['actionWindow']),
  },
  mounted() {
    this.getGroupRoleManagerList()
  },
  methods: {
    getGroupRoleManagerList() {
      IMGetGroupRoleManagerList(this.actionWindow.toUser).then(res => {
        console.log(res.data)
        this.groupRoleManagerInfo = res?.data || {};
      }).catch((err) => {
        console.log(err)
      });
    },
    changeMember(type) {
      this.$emit('changeGroupMember', type);
    },
    openGroupRecord() {
      this.$emit('groupRecord');
    },
    openGroupTransfer() {
      this.$emit('groupTransfer');
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

      .btn {
        width: 36px;
        height: 36px;
        margin-right: 10px;
        background: $bg-white-color;
        border-radius: 5px;
        border: 1px dashed $split-line-color;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;
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
