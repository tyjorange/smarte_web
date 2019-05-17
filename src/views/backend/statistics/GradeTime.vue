<!-- 分级分时统计 -->
<template>
  <section style="padding: 10px;">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-cascader
            :options="opt1"
            v-model="filters.collectorID"
            :show-all-levels="false"
            expand-trigger="hover"
            placeholder="集中器"
            clearable/>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.timeTypeValue"
            name="timeType">
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
              v-model="filters.month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              type="month"
              placeholder="选择月"/>
          </div>
          <div v-if="filters.timeTypeValue == 1" class="block">
            <el-date-picker
              v-model="filters.year"
              format="yyyy"
              value-format="yyyy"
              type="year"
              placeholder="选择年"/>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" >导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      :data="tableData"
      :summary-method="getSummaries"
      style="width: 100%; margin-top: 20px"
      stripe
      border
      highlight-current-row
      show-summary
      align="center">
      <el-table-column
        label="用能单元"
        width="200"
        prop="collectorName"
        style="height:50px"
        fixed/>
      <div v-if="filters.timeTypeValue == 0">
        <el-table-column
          :label="filters.month"
          :show-overflow-tooltip="true"
          width="800">
          <template v-for="(col) in cols">
            <el-table-column
              :show-overflow-tooltip="true"
              :label="col.label"
              :prop="col.prop"
              :key="col.key"
              :formatter="toFixed"
              width="120px"
              style="height:50px"/>
          </template>
        </el-table-column>
      </div>
      <div v-if="filters.timeTypeValue == 1">
        <el-table-column
          :label="filters.year"
          :show-overflow-tooltip="true"
          width="800">
          <template v-for="(col) in cols">
            <el-table-column
              :show-overflow-tooltip="true"
              :label="col.label"
              :prop="col.prop"
              :key="col.key"
              :formatter="toFixed"
              width="120px"
              style="height:50px"/>
          </template>
        </el-table-column>
      </div>
      <div v-if="filters.timeTypeValue == 2">
        <el-table-column
          :show-overflow-tooltip="true"
          width="800"
          label="年份（单位：万千瓦时）">
          <template v-for="(col) in cols">
            <el-table-column
              :show-overflow-tooltip="true"
              :label="col.label"
              :prop="col.prop"
              :key="col.key"
              :formatter="toFixed"
              width="120px"
              style="height:50px"/>
          </template>
        </el-table-column>
      </div>
    </el-table>

  </section>
</template>

<script>

import { API_GetCollectors, API_GradeTime } from './api.js'
// import { getNowFormatDate } from '@/utils/index'

const data = () => {
  return {
    // 查询条件
    filters: {
      collectorID: ['1'],
      timeTypeValue: '0',
      month: new Date().getFullYear() + '-' + new Date().getMonth() + 1,
      year: new Date().getFullYear() - 1 + ''
    },
    opt1: [],
    timeTypeOptions: [
      {
        value: '0',
        label: '逐日'
      },
      {
        value: '1',
        label: '逐月'
      },
      {
        value: '2',
        label: '逐年'
      }
    ],
    cols: [],
    tableData: [],
    collectorID: '',
    time: ''
  }
}

export default {
  data: data,
  mounted: function() {
    this.init()
    this.onSubmit()
  },
  methods: {
    init() {
      API_GetCollectors(this.$store.getters.token)
        .then(response => {
          this.opt1 = response.data // 下拉菜单数据
        })
        .catch(error => {
          console.error(error)
        })
    },
    onSubmit() {
      if (Array.isArray(this.filters.collectorID) && this.filters.collectorID.length > 1) {
        this.collectorID = this.filters.collectorID[this.filters.collectorID.length - 1]
      }
      if (this.filters.timeTypeValue === 0) { // 逐日统计
        this.time = this.filters.month
      } else if (this.filters.timeTypeValue === 1) { // 逐月统计
        this.time = this.filters.year
      } else if (this.filters.timeTypeValue === 2) { // 逐年统计
        this.time = ''
      }
      API_GradeTime(
        this.collectorID,
        this.time,
        this.filters.timeTypeValue
      )
        .then(response => {
          this.cols = response.data.cols
          this.tableData = response.data.tableData // 手动更新列表值
        })
        .catch(error => {
          console.error(error)
        })
    },
    toFixed(row, column, cellValue, index) {
      return Math.round(cellValue * Math.pow(10, 4)) / Math.pow(10, 4)
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
            const value = Math.round(Number(curr) * Math.pow(10, 4)) / Math.pow(10, 4)
            if (!isNaN(value)) {
              return Math.round((prev + curr) * Math.pow(10, 4)) / Math.pow(10, 4)
            } else {
              return Math.round((prev) * Math.pow(10, 4)) / Math.pow(10, 4)
            }
          }, 0)
          // sums[index] += ' 元';
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
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
.el-table__fixed-footer-wrapper tbody td {
  border-top: 1px solid #ebeef5;
  background-color: #dff0d8;
  color: #606266;
}
.el-table__footer-wrapper tbody td {
    background-color: #dff0d8;
    color: #606266;
}
.el-table th{
     text-align: center;
 }
</style>
