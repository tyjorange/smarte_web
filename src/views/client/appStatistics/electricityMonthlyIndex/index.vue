<template>
  <div class="root">
    <el-row class="btn">
      <el-button type="success" plain>按月统计</el-button>
    </el-row>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form ref="ruleForm" :inline="true" :model="ruleForm" :rules="rules">
        <el-form-item label="集中器" prop="collector.code">
          <el-select v-model="ruleForm.collector" value-key="code" placeholder="请选择" @change="selectCollector">
            <el-option
              v-for="item in controllers"
              :key="item.code"
              :label="item.name"
              :value="item">
              <span v-if="item.beShared === 0">{{ item.name }}</span>
              <span v-if="item.beShared === 1">{{ item.name }}({{ item.ownerUser.username }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="断路器" prop="switchObj.switchID">
          <el-select v-model="ruleForm.switchObj" value-key="switchID" placeholder="请选择" @change="selectSwitch">
            <el-option
              v-for="item in switches"
              :key="item.switchID"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="信号类型" prop="signalType.signalsTypeID">
          <el-select v-model="ruleForm.signalType" value-key="signalsTypeID" placeholder="请选择" @change="selectSignal">
            <el-option
              v-for="item in signalTypes"
              :key="item.signalsTypeID"
              :label="item.typeName"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="timeStr">
          <el-date-picker
            v-model="ruleForm.timeStr"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择时间"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleClick('ruleForm')">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div id="myChart"/>
  </div>
</template>

<script>
import echarts from 'echarts'
import SelectTree from '@/components/SelectTree/index.vue'
import { debounce } from '@/utils'
import { getToken } from '@/utils/auth'
import { API_getCollector, API_findSignalsType, API_getSwitchByCollector, API_getSignalByMonth } from './api.js'

const animationDuration = 1500
export default {
  components: {
    SelectTree
  },
  data() {
    return {
      controllers: [],
      switches: [],
      signalTypes: [],
      rules: {// 表单验证规则
        'collector.code': [{ required: true, message: '请选择', trigger: 'change' }],
        'switchObj.switchID': [{ required: true, message: '请选择', trigger: 'change' }],
        'signalType.signalsTypeID': [{ required: true, message: '请选择', trigger: 'change' }],
        'timeStr': [{ required: true, message: '请选择时间', trigger: 'change' }]
      },
      ruleForm: {// 表单值
        collector: { code: '', name: '' },
        switchObj: { switchID: '', name: '' },
        signalType: { signalsTypeID: '', typeName: '' },
        timeStr: ''
      }
    }
  },
  mounted: function() {
    this.myChart = echarts.init(document.getElementById('myChart'), 'macarons')
    this.getCollector()
    this.findSignalsType()
    // this.drawLine([], [])
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
    getCollector() {
      API_getCollector(getToken()).then(response => {
        this.controllers = response.data.data
      }).catch(error => {
        console.error(error)
      })
    },
    findSignalsType() {
      API_findSignalsType(getToken(), 'month').then(response => {
        this.signalTypes = response.data.data
      }).catch(error => {
        console.error(error)
      })
    },
    handleClick(formData) {
      this.$refs[formData].validate((valid) => {
        if (!valid) {
          console.log('表单未验证通过')
        } else {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          API_getSignalByMonth(getToken(), this.ruleForm.switchObj.switchID, this.ruleForm.signalType.signalsTypeID, this.ruleForm.timeStr, 'month').then(response => {
            const a1 = []
            const a2 = []
            const a3 = []
            if (response.data.code === 12) {
              this.$message('暂无数据')
              this.myChart.clear()
              loading.close()
              return
            }
            response.data.data.forEach(function(value) {
              // if (value.value !== 0) {
              a1.push(value.time)
              a2.push(value.max)
              a3.push(value.min)
              // }
            })
            this.drawLine(a1, a2, a3)
            loading.close()
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    selectCollector(val) {
      this.ruleForm.switchObj = {}
      API_getSwitchByCollector(getToken(), val.code).then(response => {
        this.switches = response.data.data
      }).catch(error => {
        console.error(error)
      })
    },
    selectSwitch(val) {
      // console.log(val.name)
    },
    selectSignal(val) {
      // console.log(val.typeName)
    },
    drawLine(a1, a2, a3) {
      // 绘制图表
      this.myChart.setOption({
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
          bottom: '8%',
          containLabel: true
        },
        legend: {
          x: 'center', // 'center' | 'left' | {number},
          y: 'top', // 'center' | 'bottom' | {number}
          data: ['max', 'min']
        },
        toolbox: {
          show: true,
          right: '2%',
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        dataZoom: {
          show: true,
          realtime: true,
          start: 20,
          end: 80
        },
        xAxis: [
          {
            type: 'category',
            data: a1
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'max',
            type: 'line',
            data: a2,
            // markPoint: {
            //   data: [
            //     { name: '年最高', value: 0.1091, xAxis: 0, yAxis: 0.11 },
            //     { name: '年最低', value: 0, xAxis: 7, yAxis: 0 }
            //   ]
            // },
            // markLine: {
            //   data: [
            //     { type: 'average', name: '平均值' }
            //   ]
            // },
            itemStyle: {
              normal: {
                color: '#4ae89b'
              }
            },
            animationDuration
          },
          {
            name: 'min',
            type: 'line',
            data: a3,
            // markPoint: {
            //   data: [
            //     { name: '年最高', value: 0.1091, xAxis: 0, yAxis: 0.11 },
            //     { name: '年最低', value: 0, xAxis: 7, yAxis: 0 }
            //   ]
            // },
            // markLine: {
            //   data: [
            //     { type: 'average', name: '平均值' }
            //   ]
            // },
            itemStyle: {
              normal: {
                color: '#5fa4e8'
              }
            },
            animationDuration
          }
        ]
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .root {
    padding: 10px;
  }

  .btn {
    text-align: left;
    padding-bottom: 10px;
    border-bottom: 1px solid #c5ccd5;
  }

  .toolbar {
    padding-bottom: 0px;
    text-align: left;
    margin-top: 10px;
  }

  #myChart {
    width: 100%;
    height: 650px;
    text-align: center;
    margin-top: 60px;
  }
</style>
