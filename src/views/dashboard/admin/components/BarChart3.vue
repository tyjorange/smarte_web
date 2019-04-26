<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="逐时" name="t1">
      <!-- <div id="myChart1" :style="{height:height,width:width}" /> -->
    </el-tab-pane>
    <el-tab-pane label="逐日" name="t2">
      <!-- <div id="myChart2" :style="{height:height,width:width}" /> -->
    </el-tab-pane>
    <el-tab-pane label="逐月" name="t3">
      <!-- <div id="myChart3" :style="{height:height,width:width}" /> -->
    </el-tab-pane>
    <div id="barChart3" :style="{height:height,width:width}" />
  </el-tabs>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
const demoChartData = {
  t1: [79, 52, 321, 443, 112, 234, 432],
  t2: [80, 52, 200, 334, 390, 330, 220],
  t3: [30, 52, 111, 222, 321, 544, 112]
}
const animationDuration = 1500

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      activeName: 't3',
      chartData: demoChartData.t3
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setData(val)
      }
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('barChart3'), 'macarons')
    this.setData(this.chartData)

    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setData(actualData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 30,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        legend: {
          orient: 'horizontal', // 'vertical'
          x: 'center', // 'center' | 'left' | {number},
          y: 'top', // 'center' | 'bottom' | {number}
          data: ['上海用继电器股份有限公司']
        },
        toolbox: {
          show: true,
          right: '2%',
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: false },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '上海用继电器股份有限公司',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: actualData,
            animationDuration
          }
        ]
      })
    },
    handleClick(tab, event) {
      this.chartData = demoChartData[tab.paneName]
    }
  }
}
</script>
