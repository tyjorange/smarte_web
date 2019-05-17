<template>
  <section style="padding: 10px;">
    <el-row style="text-align: left;padding-bottom: 10px;border-bottom: 1px solid #c5ccd5;">
      <el-button type="success" plain>日志信息</el-button>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="线路名"
        width="180"/>
      <el-table-column
        prop="name"
        label="时间"
        width="180"/>
      <el-table-column
        prop="address"
        label="操作"/>
    </el-table>
  </section>
</template>

<script>
const data = () => {
  return {
    tableData: [{
      date: '照明',
      name: '2019-05-01 12:18:24',
      address: '控制关失败'
    }, {
      date: '冰箱',
      name: '2019-05-01 12:19:21',
      address: '控制关成功'
    }, {
      date: '照明',
      name: '2019-05-01 05:18:23',
      address: '控制关成功'
    }, {
      date: '空调',
      name: '2019-05-01 18:18:24',
      address: '控制关成功'
    }],
    filters: {

    }
  }
}
export default {
  data: data
}
</script>
