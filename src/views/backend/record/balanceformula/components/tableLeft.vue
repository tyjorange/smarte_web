<template>
  <div>
    <el-form ref="form" size="mini" label-width="0px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="数据项" name="col1">
          <template slot="title">
            能源种类
            <el-button-group class="groupbt">
              <el-button type="primary" size="mini" @click="onSubmit">新增</el-button>
              <el-button type="primary" size="mini" @click="onSubmit">修改</el-button>
              <el-button type="primary" size="mini" @click="onSubmit">删除</el-button>
              <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
              <el-button type="primary" size="mini" @click="onSubmit">导出</el-button>
            </el-button-group>
          </template>
          <el-form-item>
            <template>
              <el-radio-group v-model="radio1">
                <el-radio :label="1" border>电力</el-radio>
                <el-radio :label="2" border>水</el-radio>
                <el-radio :label="3" border>热能</el-radio>
                <el-radio :label="4" border>热水</el-radio>
                <el-radio :label="5" border>天然气</el-radio>
                <el-radio :label="6" border>蒸汽</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
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
        <el-table-column prop="date" label="公式名称" width="180"/>
        <el-table-column prop="name" label="能源种类" width="180"/>
        <el-table-column prop="address" label="输入公式"/>
        <el-table-column prop="address" label="输出公式"/>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: 'col1',
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
}
.el-table {
  width: 100%;
  margin-top: 12px;
}
</style>
