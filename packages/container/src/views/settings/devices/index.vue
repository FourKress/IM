<template>
  <div class="page">
    <div class="panel">
      <div class="top">我的常用设备</div>
      <div class="tips">您可以对退出指定设备，或取消消耗设备的常</div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="date"
          label="设备型号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="系统版本"
          width="180"
        ></el-table-column>
        <el-table-column prop="address" label="串号/MAC"></el-table-column>
        <el-table-column
          prop="date"
          label="最后登录时间"
          width="180"
        ></el-table-column>
        <el-table-column prop="name" label="状态" width="180"></el-table-column>
        <el-table-column label="操作" width='90'>
          <template slot-scope="scope">
            <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Devices',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    };
  },
  methods: {
    handleView(row) {
      console.log(row);
    },
    handleEdit(row) {
      console.log(row);
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  flex: 1;
  height: calc(100% - 60px);
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .panel {
    min-width: 1075px;

    .top {
      width: 100%;
      font-size: 30px;
      font-weight: bold;
      color: $main-text-color;
      margin: 176px 0 8px;
    }

    .tips {
      width: 100%;
      font-size: 14px;
      color: $tips-text-color;
      margin-bottom: 60px;
    }
  }
}
</style>
