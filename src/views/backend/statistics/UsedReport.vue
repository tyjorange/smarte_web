<!-- 能耗周期报表 -->
<template>
  <section style="padding: 10px;">

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: left;margin-top: 10px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <template>
            <el-form>
              <el-form-item>
                <select-tree v-model="statisticalObjects" :options="options" :props="defaultProps" />
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
          </div>
          <div v-if="filters.timeTypeValue == 1" class="block">
            <el-date-picker
              v-model="filters.month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              type="month"
              placeholder="选择月"/>
          </div>
          <div v-if="filters.timeTypeValue == 2" class="block">
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
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <template>
      <div style="text-align: center;">
        <label>最大值：</label>
        <span id="maxUsed" class="font-green-meadow bold">270.52</span>
        <span id="maxUsedUnit" style="font-weight: normal;padding-left: 8px;">千瓦时</span>
        <label>最小值：</label>
        <span id="minUsed" class="font-green-meadow bold">152.12</span>
        <span id="minUsedUnit" style="font-weight: normal;padding-left: 8px;">千瓦时</span>
        <label>平均值：</label>
        <span id="avgUsed" class="font-green-meadow bold">211.32</span>
        <span id="avgUsedUnit" style="font-weight: normal;padding-left: 8px;">千瓦时</span>

      </div>
    </template>

    <template>
      <el-table :data="tableData" style="width: 100%; margin-top: 20px" stripe border highlight-current-row align="center">
        <el-table-column label="名称" prop="collectorName" style="height:50px"/>
        <el-table-column label="数据项" prop="data" style="height:50px"/>
        <el-table-column label="能耗值" prop="value" style="height:50px"/>
        <el-table-column label="单位" prop="unit" style="height:50px"/>
        <el-table-column label="周期" prop="cycle" style="height:50px"/>
        <el-table-column label="数据时间" prop="dataTime" style="height:50px"/>
        <el-table-column label="能源类型" prop="energyType" style="height:50px"/>

      </el-table>
    </template>

  </section>
</template>

<script>

import SelectTree from '@/components/SelectTree/index.vue'

const data = () => {
  return {
    timeTypeOptions: [{
      value: '0',
      label: '日'
    }, {
      value: '1',
      label: '月'
    }, {
      value: '2',
      label: '自定义'
    }],
    // 默认选中值
    statisticalObjects: 'root',
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
      timeTypeValue: '0',
      startTime: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDay(),
      endTime: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDay(),
      month: new Date().getFullYear() + '-' + new Date().getMonth() + '-'
    },
    tableData: [
      {
        collectorName: '智能研发部办公室',
        data: '表码',
        value: '270.52',
        unit: '千瓦时',
        cycle: '8日',
        dataTime: '2019-01-01~2019-01-08',
        energyType: '电力'
      },
      {
        collectorName: '索罗思腾内网测试',
        data: '表码',
        value: '152.12',
        unit: '千瓦时',
        cycle: '8日',
        dataTime: '2019-01-01~2019-01-08',
        energyType: '电力'
      }
    ]
  }
}

export default {
  components: {
    SelectTree
  },
  data: data,
  mounted: function() {

  },
  methods: {

  }
}
</script>

<style>
 .el-table th{
     text-align: center;
 }
 .font-green-meadow {
    color: #1BBC9B!important;
}
.bold {
    font-weight: 700!important;
}
#energytype, #maxUsedUnit, #minUsedUnit {
    padding-right: 80px;
}
</style>
