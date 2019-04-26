<template>
  <div>
    <el-form ref="form" size="mini" label-width="0px">
      <!-- <el-collapse v-model="activeNames">
        <el-collapse-item title="数据项" name="col1"> -->
      <el-button-group class="groupbt">
        <el-button type="primary" size="mini" @click="onSubmit">新增</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">修改</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">删除</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">导出</el-button>
      </el-button-group>
      <!-- </el-collapse-item>
      </el-collapse> -->
      <el-table
        v-loading="listLoading"
        :header-cell-style="tableHeaderColor"
        :data="tableData"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.1)"
        size="small"
        border
        stripe
        highlight-current-row>
        <el-table-column type="index"/>
        <el-table-column prop="date" label="告警类型" width="180"/>
        <el-table-column prop="name" label="基准对象" width="180"/>
        <el-table-column prop="address" label="比较对象"/>
        <el-table-column prop="name" label="方案"/>
        <el-table-column prop="name" label="对比时间"/>
        <el-table-column prop="name" label="数据类型"/>
        <el-table-column prop="name" label="阈值"/>
        <el-table-column prop="name" label="额外参数"/>
        <el-table-column prop="name" label="创建人"/>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: '',
      radio1: 1,
      tableData: [],
      listLoading: false
    }
  },
  methods: {
    onSubmit() {},
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #eee;color: #000;'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  margin: 3px;
  margin-right: 0px;
}
.el-form-item {
  margin: 0px;
}
.groupbt {
  float: right;
  margin-right: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-table {
  width: 100%;
  margin-top: 12px;
}
.el-collapse-item__content {
  padding-bottom: 0px;
}
</style>
