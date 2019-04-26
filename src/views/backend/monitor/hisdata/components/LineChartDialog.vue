<template>
  <div>
    <el-form ref="form" size="mini" label-width="0px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="数据项" name="col1">
          <template slot="title">
            数据选项
            <el-button-group class="groupbt">
              <el-button type="primary" size="mini" @click="onSubmit">刷新</el-button>
              <el-button type="primary" size="mini" @click="onSubmit">导出</el-button>
            </el-button-group>
          </template>
          <template>
            <el-form-item>
              时间范围：
            </el-form-item>
            <div class="block">
              <el-date-picker
                v-model="timeValue"
                :picker-options="pickerOptions2"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="left"
                size="mini"/>
            </div>
            <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">电量：</el-checkbox>
            <el-checkbox-group v-model="checkedItem1" size="mini" @change="handleCheckAllChange1">
              <el-checkbox v-for="item in Items1" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>

            <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">功率：</el-checkbox>
            <el-checkbox-group v-model="checkedItem2" size="mini" @change="handleCheckAllChange2">
              <el-checkbox v-for="item in Items2" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>

            <el-checkbox :indeterminate="isIndeterminate3" v-model="checkAll3" @change="handleCheckAllChange3">其他：</el-checkbox>
            <el-checkbox-group v-model="checkedItem3" size="mini" @change="handleCheckAllChange3">
              <el-checkbox v-for="item in Items3" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-collapse-item>
      </el-collapse>

      <div id="lineChart" :style="{height:mHeight,width:mWidth}" />

      <el-table
        v-loading="listLoading"
        :header-cell-style="tableHeaderColor"
        :data="tableData"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.1)"
        style="width: 100%"
        size="small"
        border
        stripe
        highlight-current-row
        max-height="380">
        <el-table-column type="index"/>
        <el-table-column prop="switchName" label="断路器" sortable width="120"/>
        <el-table-column prop="collectorName" label="集中器" sortable width="120"/>
        <el-table-column :formatter="cellRender" prop="dataTime" label="采集时间" sortable width="180"/>
        <el-table-column v-for="item in formThead" :prop="item.id" :key="item.id" :label="item.name" align="right"/>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="onSubmit" />
    </el-form>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce, parseTime } from '@/utils'
import { API_GetSignalsHis } from '@/api/monitor/hisdata'
import { formatTime } from '@/utils/index'
import Pagination from '@/components/Pagination'

const itemOptions1 = [
  { id: 'wgdl', name: '无功电量' },
  { id: 'ygdl', name: '有功电量' }
]
const itemOptions2 = [
  { id: 'wggl', name: '无功功率' },
  { id: 'yggl', name: '有功功率' }
]
const itemOptions3 = [
  { id: 'glys', name: '功率因数' },
  { id: 'dl', name: '电流' },
  { id: 'dy', name: '电压' },
  { id: 'pl', name: '频率' },
  { id: 'wd', name: '温度' }
]
export default {
  components: { Pagination },
  props: {
    tempRow: { type: [Object], required: false, default: itemOptions3 }
  },
  data() {
    return {
      autoResize: true,
      mHeight: '350px',
      mWidth: '100%',
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      timeValue: [new Date(Date.now() - 3600 * 1000 * 24 * 1), new Date()],
      tableData: [],
      activeNames: 'col1',
      checkAll1: true,
      checkAll2: false,
      checkAll3: false,
      formThead: itemOptions1,
      checkedItem1: itemOptions1,
      checkedItem2: [],
      checkedItem3: [],
      isIndeterminate1: false,
      isIndeterminate2: false,
      isIndeterminate3: false,
      Items1: itemOptions1,
      Items2: itemOptions2,
      Items3: itemOptions3,
      radio1: 1,
      radio2: 8,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 100
      }
    }
  },
  watch: {
    tempRow: {
      deep: true,
      handler(val) {
        this.onSubmit()
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        'transitionend',
        this.sidebarResizeHandler
      )
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }
    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        'transitionend',
        this.sidebarResizeHandler
      )
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions(
      dateList,
      type,
      valueList1,
      valueList2,
      valueList3,
      valueList4,
      valueList5
    ) {
      this.chart.setOption({
        xAxis: {
          data: dateList,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: type
        },
        series: [
          {
            name: type[0],
            smooth: true,
            type: 'line',
            data: valueList1,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: type[1],
            smooth: true,
            type: 'line',
            data: valueList2,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: type[2],
            smooth: true,
            type: 'line',
            data: valueList3,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: type[3],
            smooth: true,
            type: 'line',
            data: valueList4,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: type[4],
            smooth: true,
            type: 'line',
            data: valueList5,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(
        document.getElementById('lineChart'),
        'macarons'
      )
      this.onSubmit()
    },
    onSubmit() {
      if (this.listLoading) {
        this.activeNames = 'col1'
        console.log('Loading...')
      } else {
        this.listLoading = true
        API_GetSignalsHis(
          this.tempRow.switchID,
          this.checkedItem1,
          this.checkedItem2,
          this.checkedItem3,
          this.timeValue,
          this.listQuery.page,
          this.listQuery.limit
        )
          .then(response => {
            // 切换表头
            if (this.checkAll1) {
              this.formThead = itemOptions1
            } else if (this.checkAll2) {
              this.formThead = itemOptions2
            } else if (this.checkAll3) {
              this.formThead = itemOptions3
            }
            this.tableData = response.data // 手动更新左表值
            this.reloadChart(response.data)
            this.total = response.total
            this.listLoading = false
            if (this.total === 0) {
              this.activeNames = 'col1'
            } else {
              this.activeNames = ''
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    handleCheckAllChange1(val) {
      this.checkedItem1 = val ? itemOptions1 : []
      this.isIndeterminate1 = false
      if (this.checkAll1 === false) {
        this.checkAll1 = true
      }
      if (val) {
        this.checkedItem2 = []
        this.checkAll2 = false
        this.isIndeterminate2 = false
        this.checkedItem3 = []
        this.checkAll3 = false
        this.isIndeterminate3 = false
      }
    },
    handleCheckAllChange2(val) {
      this.checkedItem2 = val ? itemOptions2 : []
      this.isIndeterminate2 = false
      if (this.checkAll2 === false) {
        this.checkAll2 = true
      }
      if (val) {
        this.checkedItem1 = []
        this.checkAll1 = false
        this.isIndeterminate1 = false
        this.checkedItem3 = []
        this.checkAll3 = false
        this.isIndeterminate3 = false
      }
    },
    handleCheckAllChange3(val) {
      this.checkedItem3 = val ? itemOptions3 : []
      this.isIndeterminate3 = false
      if (this.checkAll3 === false) {
        this.checkAll3 = true
      }
      if (val) {
        this.checkedItem1 = []
        this.checkAll1 = false
        this.isIndeterminate1 = false
        this.checkedItem2 = []
        this.checkAll2 = false
        this.isIndeterminate2 = false
      }
    },
    cellRender(row, column, cellValue, index) {
      return formatTime(cellValue)
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #eee;color: #000;'
      }
    },
    reloadChart(responseData) {
      var dateList = responseData.map(function(item) {
        return parseTime(new Date(item.dataTime))
      })
      if (this.checkedItem1.length !== 0) {
        const valueList1 = responseData.map(function(item) {
          return item.ygdl
        })
        const valueList2 = responseData.map(function(item) {
          return item.wgdl
        })
        const type1 = [this.checkedItem1[0].name, this.checkedItem1[1].name]
        this.setOptions(dateList, type1, valueList1, valueList2)
      } else if (this.checkedItem2.length !== 0) {
        const valueList3 = responseData.map(function(item) {
          return item.yggl
        })
        const valueList4 = responseData.map(function(item) {
          return item.wggl
        })
        const type2 = [this.checkedItem2[0].name, this.checkedItem2[1].name]
        this.setOptions(dateList, type2, valueList3, valueList4)
      } else if (this.checkedItem3.length !== 0) {
        const valueList5 = responseData.map(function(item) {
          return item.glys
        })
        const valueList6 = responseData.map(function(item) {
          return item.dl
        })
        const valueList7 = responseData.map(function(item) {
          return item.dy
        })
        const valueList8 = responseData.map(function(item) {
          return item.pl
        })
        const valueList9 = responseData.map(function(item) {
          return item.wd
        })
        const type3 = [
          this.checkedItem3[0].name,
          this.checkedItem3[1].name,
          this.checkedItem3[2].name,
          this.checkedItem3[3].name,
          this.checkedItem3[4].name
        ]
        this.setOptions(
          dateList,
          type3,
          valueList5,
          valueList6,
          valueList7,
          valueList8,
          valueList9
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.groupbt {
  float: right;
  margin-right: 5px;
  margin-top: 10px;
}
.el-table {
  width: 100%;
  margin-top: 10px;
}
</style>
