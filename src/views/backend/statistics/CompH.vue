<!-- 横向对比分析 -->
<template>
  <section style="padding: 10px;">
    <el-row style="text-align: left;padding-bottom: 10px;border-bottom: 1px solid #c5ccd5;">
      <el-button type="success" plain>逐时</el-button>
      <el-button type="success" plain>逐日</el-button>
      <el-button type="success" plain>逐月</el-button>

      <div class="block" style="float: right;">

        <el-date-picker v-model="year" type="year" placeholder="选择年"/>
      </div>
      <label style="float: right;line-height: 40px;margin-right: 5px;">年份</label>

    </el-row>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: left;margin-top: 10px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <template>
            <el-form>
              <el-form-item label="统计对象">
                <select-tree v-model="statisticalObjects" :options="options" :props="defaultProps" />
              </el-form-item>
            </el-form>
          </template>
        </el-form-item>
        <el-form-item>
          <template>
            <el-form>
              <el-form-item label="比较对象">
                <select-tree v-model="otherObjects" :options="options" :props="defaultProps" />
              </el-form-item>
            </el-form>
          </template>
        </el-form-item>
        <template>
          <el-form-item label="能源种类">
            <el-select v-model="energyType" placeholder="请选择">
              <el-option
                v-for="item in energyTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <template>
      <div id="myChart" style="width:100%;height:650px;text-align: center;margin-top: 60px;"/>
    </template>

    <template>
      <el-table :data="tableData" style="width: 100%; margin-top: 20px" stripe border highlight-current-row align="center">
        <el-table-column label="用能单元" prop="collectorName" style="height:50px"/>
        <el-table-column width="800" label="2018年（单位：万千瓦时）">
          <template v-for="(col) in cols">
            <el-table-column
              :show-overflow-tooltip="true"
              :label="col.label"
              :prop="col.prop"
              :key="col.key"
              width="120px"
              style="height:50px"/>
          </template>
        </el-table-column>
      </el-table>
    </template>

  </section>
</template>

<script>

// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

import SelectTree from '@/components/SelectTree/index.vue'

const data = () => {
  return {
    // 默认选中值
    statisticalObjects: 'root',
    otherObjects: '1',
    // 数据默认字段
    defaultProps: {
      parent: 'parentId', // 父级唯一标识
      value: 'id', // 唯一标识
      label: 'label', // 标签显示
      children: 'children' // 子级
    },
    // 数据列表
    options: [
      {
        parentId: '0',
        id: 'root',
        label: '上海永继电气股份有限公司',
        children: [
          {
            parentId: 'root',
            id: '1',
            label: '智能研发部办公室'
          },
          {
            parentId: 'root',
            id: '2',
            label: '索罗思腾内网测试'
          }
        ]
      }
    ],
    energyTypeOptions: [{
      value: '1',
      label: '电力'
    }, {
      value: '2',
      label: '水'
    }, {
      value: '3',
      label: '热能'
    }, {
      value: '4',
      label: '燃气'
    }],
    energyType: '1',
    filters: {

    },
    year: new Date().getFullYear() + '',
    cols: [
      {
        'label': '01',
        'prop': 'timeValue.01'
      }, {
        'label': '02',
        'prop': 'timeValue.02'
      }, {
        'label': '03',
        'prop': 'timeValue.03'
      }, {
        'label': '04',
        'prop': 'timeValue.04'
      }, {
        'label': '05',
        'prop': 'timeValue.05'
      }, {
        'label': '06',
        'prop': 'timeValue.06'
      }, {
        'label': '07',
        'prop': 'timeValue.07'
      }, {
        'label': '08',
        'prop': 'timeValue.08'
      }, {
        'label': '09',
        'prop': 'timeValue.09'
      }, {
        'label': '10',
        'prop': 'timeValue.10'
      }, {
        'label': '11',
        'prop': 'timeValue.11'
      }, {
        'label': '12',
        'prop': 'timeValue.12'
      }],
    'tableData': [
      {
        'collectorName': '上海永继电气股份有限公司',
        'timeValue': {
          '01': 2.6,
          '02': 5.9,
          '03': 9,
          '04': 26.4,
          '05': 28.7,
          '06': 70.7,
          '07': 175.6,
          '08': 182.2,
          '09': 48.7,
          '10': 18.8,
          '11': 6,
          '12': 2.3
        }
      },
      {
        'collectorName': '智能研发部办公室',
        'timeValue': {
          '01': 2,
          '02': 4.9,
          '03': 7,
          '04': 23.2,
          '05': 25.6,
          '06': 66.7,
          '07': 135.6,
          '08': 162.2,
          '09': 32.6,
          '10': 16,
          '11': 5.4,
          '12': 1.3
        }
      }]
  }
}

export default {
  components: {
    SelectTree
  },
  data: data,
  mounted: function() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['上海永继电气股份有限公司', '智能研发部办公室']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '上海永继电气股份有限公司',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            markPoint: {
              data: [
                { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
                { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            },
            itemStyle: {
              normal: {
                color: '#63B8FF'
              }
            }
          },
          {
            name: '智能研发部办公室',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 66.7, 135.6, 162.2, 32.6, 16.0, 5.4, 1.3],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            },
            itemStyle: {
              normal: {
                color: '#40E0D0'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style>
 .el-table th{
     text-align: center;
 }
</style>
