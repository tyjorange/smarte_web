<!-- 分类汇总统计 -->
<template>
  <section style="padding: 10px;">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.collectorID" placeholder="" @focus="geCollector()" >
            <el-option
              v-for="item in collectors"
              :key="item.collectorid"
              :label="item.name"
              :value="item.collectorid"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.timeTypeValue" name="timeType">
            <el-option
              v-for="item in timeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div v-if="filters.timeTypeValue == 0" class="block">
            <el-date-picker
              v-model="filters.startTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"/>
            <span style="vertical-align: top;">——</span>
            <el-date-picker
              v-model="filters.endTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"/>
          </div>
          <div v-if="filters.timeTypeValue == 1" class="block">
            <span class="demonstration" style="vertical-align: top;">年</span>
            <el-date-picker
              v-model="filters.year"
              format="yyyy"
              value-format="yyyy"
              type="year"
              placeholder="选择年"/>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="handleAdd">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-card class="box-card" style="height:320px;">
      <div slot="header" class="clearfix" style="text-align: left;">
        <span style="color:#2DC3D0;"><i class="el-icon-info"/> <b>能耗分类汇总统计表</b> </span>
      </div>
      <div class="text item">
        <el-table :data="summData" style="width: 100%; margin-top: 20px" stripe border align="center">
          <el-table-column label="能源种类" prop="energyType" style="height:50px"/>
          <el-table-column label="实物量" prop="converting" style="height:50px"/>
          <el-table-column label="计量单位" prop="unit" style="height:50px"/>
          <el-table-column label="折标系数" prop="factor" style="height:50px"/>
          <el-table-column label="当量值" style="height:50px">
            <el-table-column label="折标准煤(吨标准煤)" prop="coal" style="height:50px"/>
            <el-table-column label="占比(%)" prop="proportion" style="height:50px"/>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="box-card" style="width:49.85%;height: 420px;float:left;margin-top: 8px;">
      <div slot="header" class="clearfix" style="text-align: left;">
        <span style="color:#2DC3D0;"><i class="el-icon-info"/> <b>分项占比</b> </span>
      </div>
      <!-- 图表 -->
      <template>
        <div id="itemPieChart" style="width:100%;height:350px;text-align: center;"/>
      </template>
    </el-card>

    <el-card class="box-card" style="width:49.85%;height: 420px;float:right;margin-top: 8px;">
      <div slot="header" class="clearfix" style="text-align: left;">
        <span style="color:#2DC3D0;"><i class="el-icon-info"/> <b>分级占比</b> </span>
      </div>
      <template>
        <el-table
          id="gradeTable"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label=""
            width="180"/>
          <el-table-column
            prop="name"
            label=""
            width="180"/>
          <el-table-column
            prop="address"
            label=""/>
        </el-table>
      </template>
    </el-card>

  <!--底部-->
  <!-- <el-col :span="24" class="toolbar">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
    </el-pagination>
  </el-col> -->

  </section>
</template>

<script>

import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import { debounce } from '@/utils'

const data = () => {
  return {
    // 页码
    page: 1,
    // 每页数量
    size: 20,
    // 总数
    total: 0,
    // 查询条件
    filters: {
      collectorID: '',
      timeTypeValue: '0',
      startTime: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDay(),
      endTime: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDay()
    },
    // 页面数据
    rows: [],
    // 页面载入状态
    pageLoading: false,
    // 列表高度
    clientHeight: '100%',
    collectors: [],
    timeTypeOptions: [{
      value: '0',
      label: '自定义'
    }, {
      value: '1',
      label: '月'
    }, {
      value: '2',
      label: '年'
    }],
    summData: [{
      energyType: '电力',
      converting: '0.4428',
      unit: '万千瓦时',
      factor: '1.2290',
      coal: '0.5442',
      proportion: '100.00'
    }],
    tableData: [{
      date: '智能研发部办公室',
      name: '0.21',
      address: '48%'
    }, {
      date: '索罗思腾内网测试',
      name: '0.2328',
      address: '52%'
    }]

  }
}

const handleAdd = function() {

}

const handleEdit = function(index, row) {

}

const handleDelete = function(index, row) {

}

const getRows = function() {
  if (this.pageLoading) { return }
  this.pageLoading = true

  // 调用post请求
  const url = '/gradeSubentry'
  var params = new URLSearchParams()
  params.append('collectorID', this.filters.collectorID) // 你要传给后台的参数值 key/value
  if (this.filters.timeTypeValue === 0) {
    params.append('startTime', this.filters.startTime)
    params.append('endTime', this.filters.endTime)
  } else if (this.filters.timeTypeValue === 1) {
    params.append('startTime', this.filters.startTime)
  } else {
    params.append('time', '')
  }
  params.append('timeType', this.filters.timeTypeValue)
  this.$axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    this.pageLoading = false

    if (res.data.code === 403) {
      this.common.notywarn(
        this.$notify,
        res.data.code,
        res.data.msg
      )
      this.$router.replace({ path: '/' })
    }

    if (!res.data || !res.data.data) { return }
    // 总数赋值
    this.total = res.data.data.total
    this.page++
    // 页面元素赋值
    this.rows = res.data.data
  }).catch() // e => this.pageLoading = false
}

const handleQuery = function() {
  this.getRows()
}

const handleCurrentChange = function(val) {
  this.page = val
  this.getRows()
}

const initHeight = function() {
  this.clientHeight = (document.documentElement.clientHeight - 258) + 'px'
}

// let geCollector = function() {
//   this.$axios({
//             method: 'get',
//             url:"/getCollector",
//             data:null,
//         }).then((res)=>{
//             this.collectors = res.data.data;
//         });
// }

const geCollector = function() {
  this.collectors = [{ collectorid: '1', name: '智能研发部办公室' }, { collectorid: '2', name: '索罗思腾内网测试' }]
}

const drawPie = function() {
  // 基于准备好的dom，初始化echarts实例
  const itemPieChart = echarts.init(document.getElementById('itemPieChart'))
  // 绘制图表
  itemPieChart.setOption({
    title: {
      text: '能源分项占比统计图',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: ['动力', '照明', '空调', '空压', '电梯', '生活', '特殊']
    },
    series: [{
      name: '能源用量',
      type: 'pie',
      roseType: 'radius',
      radius: [15, 95],
      center: ['50%', '38%'],
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: '{b} : {c} ({d}%)'
          },
          labelLine: { show: true }
        }
      },
      animationEasing: 'cubicInOut',
      animationDuration: 1500,
      data: [
        { value: 220, name: '动力' },
        { value: 240, name: '照明' },
        { value: 249, name: '空调' },
        { value: 100, name: '空压' },
        { value: 259, name: '电梯' },
        { value: 100, name: '生活' },
        { value: 190, name: '特殊' }
      ]
    }]
  })
}

export default {
  data: data,
  mounted() {
    this.drawPie()
    this.drawLine()
  },
  methods: {
    // 查询
    handleQuery,
    // 添加
    handleAdd,
    // 修改
    handleEdit,
    // 删除
    handleDelete,
    // 页数改变
    handleCurrentChange,
    // 获取分页
    getRows,
    // 获取所有集中器列表
    geCollector,
    // 初始化高度
    initHeight,
    // 初始化饼状图
    drawPie,
    // 改变行样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => {
          return Number(item.timeValue[column.property.split('.')[1]])
        })
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // sums[index] += ' 元';
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: 'ECharts 入门示例' },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    }
  }
}
</script>

<style>
 .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  #gradeTable .has-gutter {
    display: none;
  }
  .el-table th{
     text-align: center;
 }
</style>
