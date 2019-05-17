<template>
  <section style="padding: 10px;">
    <el-row style="text-align: left;padding-bottom: 10px;border-bottom: 1px solid #c5ccd5;">
      <el-button type="success" plain>按天统计</el-button>
      <el-button type="success" plain>按月统计</el-button>
    </el-row>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: left;margin-top: 10px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <template>
            <el-form>
              <el-form-item label="集中器">
                <el-select v-model="controllers" placeholder="请选择">
                  <el-option
                    v-for="item in controllersObjects"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-form-item>
        <template>
          <el-form-item label="断路器">
            <el-select v-model="statisticType" placeholder="请选择">
              <el-option
                v-for="item in statisticalObjects"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </template>
        <template>
          <el-form-item label="信号类型">
            <el-select v-model="energyType" placeholder="请选择">
              <el-option
                v-for="item in energyTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </template>
        <template>
          <el-form-item label="时间">
            <el-date-picker v-model="createdate" type="month" value-format="yyyy-MM" placeholder="选择时间" @change="formatTime"/>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="线路名"
        width="180"/>
      <el-table-column
        prop="name"
        label="用电量（度）"
        width="180"/>
      <el-table-column
        prop="address"
        label="电费（元）"/>
    </el-table>
  </section>
</template>

<script>
const data = () => {
  return {
    controllersObjects: [
      {
        value: '1',
        label: '测试机器1号'
      }, {
        value: '2',
        label: '测试机器2号'
      }],
    statisticalObjects: [
      {
        value: '1',
        label: '冰箱'
      }, {
        value: '2',
        label: '空调'
      }, {
        value: '3',
        label: '照明'
      }, {
        value: '4',
        label: '洗衣机'
      }
    ],
    energyTypeOptions: [{
      value: '1',
      label: '有功电量'
    }, {
      value: '2',
      label: '无功电量'
    }, {
      value: '3',
      label: '电压'
    }, {
      value: '4',
      label: '电流'
    }, {
      value: '5',
      label: '有功功率'
    }, {
      value: '6',
      label: '无功功率'
    }, {
      value: '7',
      label: '功率因素'
    }, {
      value: '8',
      label: '频率'
    }, {
      value: '9',
      label: '温度'
    }],
    tableData: [{
      date: '照明',
      name: '5',
      address: '2.58'
    }, {
      date: '冰箱',
      name: '16',
      address: '10.8'
    }, {
      date: '电脑',
      name: '3',
      address: '4.28'
    }, {
      date: '空调',
      name: '60',
      address: '34.68'
    }],
    energyType: '1',
    statisticType: '1',
    controllers: '1',
    createdate: '',
    filters: {

    }
  }
}
export default {
  data: data,
  methods: {
    formatTime(time) {
      this.createdate = time
    }
  }
}
</script>
