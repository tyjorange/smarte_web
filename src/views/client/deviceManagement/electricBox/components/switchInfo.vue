<template>
  <div>
    <!--<el-popover placement="right" width="100%" trigger="click">-->
    <div class="component-item">
      <el-button :value="switchCode" size="mini">
        <p>{{ switchCode }}</p>
      </el-button>
      <div id="pieChart1"/>
    </div>
    <!--<el-button slot="reference" size="mini" icon="el-icon-arrow-right" type="primary"/>-->
    <!--</el-popover>-->
  </div>
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
const demoChartData = {
  t1: [
    { value: 320, name: '动力' },
    { value: 240, name: '照明' },
    { value: 149, name: '空调' },
    { value: 100, name: '空压' },
    { value: 259, name: '电梯' },
    { value: 100, name: '生活' },
    { value: 190, name: '特殊' }
  ],
  t2: [
    { value: 120, name: '动力' },
    { value: 140, name: '照明' },
    { value: 149, name: '空调' },
    { value: 100, name: '空压' },
    { value: 159, name: '电梯' },
    { value: 100, name: '生活' },
    { value: 190, name: '特殊' }
  ],
  t3: [
    { value: 220, name: '动力' },
    { value: 240, name: '照明' },
    { value: 249, name: '空调' },
    { value: 100, name: '空压' },
    { value: 259, name: '电梯' },
    { value: 100, name: '生活' },
    { value: 190, name: '特殊' }
  ]
}
export default {
  name: 'SwitchInfoComponents',
  props: {// 父组件传值
    switchCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chartData: demoChartData.t3
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('pieChart1'), 'macarons')
    this.getChartData('t3')
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
    getChartData(type) {
      const loading = this.$loading({
        text: '查询中',
        background: 'rgba(0, 0, 0, 0.1)',
        target: document.querySelector('.component-item')
      })
      // API_GetPieChartData(new Date(), type).then(Response => {
      //   this.chartData = demoChartData[type]
      this.setData(this.chartData)
      loading.close()
      // }).catch(error => {
      //   console.error(error)
      // })
    },
    setData(actualData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['动力', '照明', '空调', '空压', '电梯', '生活', '特殊']
        },
        calculable: true,
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: actualData,
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
            animationDuration: 1500
          }
        ]
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #pieChart1{
    width: 530px;
    height: 300px;
  }
  .component-item {
    min-height: 360px;
  }
</style>
