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
              断路器上报状态：
            </el-form-item>
            <el-form-item>
              <template>
                <el-radio-group v-model="radio2">
                  <el-radio :label="8" border>所有</el-radio>
                  <el-radio :label="7" border>未实时上报</el-radio>
                  <el-radio :label="6" border>实时上报</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item>
              费率类型：
            </el-form-item>
            <el-form-item>
              <template>
                <el-radio-group v-model="radio1">
                  <el-radio :label="1" border>总</el-radio>
                  <el-radio :label="2" border>尖</el-radio>
                  <el-radio :label="3" border>峰</el-radio>
                  <el-radio :label="4" border>平</el-radio>
                  <el-radio :label="5" border>谷</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">电量：</el-checkbox>
            <el-checkbox-group v-model="checkedItem1" size="mini" @change="handleCheckedItemChange1">
              <el-checkbox v-for="item in Items1" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">功率：</el-checkbox>
            <el-checkbox-group v-model="checkedItem2" size="mini" @change="handleCheckedItemChange2">
              <el-checkbox v-for="item in Items2" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox :indeterminate="isIndeterminate3" v-model="checkAll3" @change="handleCheckAllChange3">其他：</el-checkbox>
            <el-checkbox-group v-model="checkedItem3" size="mini" @change="handleCheckedItemChange3">
              <el-checkbox v-for="item in Items3" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-collapse-item>
      </el-collapse>

      <el-table
        v-loading="listLoading"
        :header-cell-style="tableHeaderColor"
        :data="tableData"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.1)"
        size="small"
        border
        stripe
        highlight-current-row>
        <el-table-column type="index"/>
        <el-table-column prop="switchName" label="断路器" sortable/>
        <el-table-column prop="collectorName" label="集中器" min-width="120" sortable/>
        <el-table-column prop="signalsTypeName" label="数据项" sortable/>
        <el-table-column prop="fl" label="费率" min-width="30"/>
        <el-table-column prop="bl" label="倍率" min-width="30"/>
        <el-table-column prop="dataValue" label="数据值" align="right" sortable/>
        <el-table-column prop="dataUnit" label="计量单位" align="right"/>
        <el-table-column prop="dataLoop" label="采集周期"/>
        <el-table-column :formatter="cellRender" prop="dataTime" label="最新采集时间" min-width="100" sortable/>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { API_GetSignals } from '@/api/monitor/realdata'
import { formatTime } from '@/utils/index'
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
  data() {
    return {
      tableData: [],
      activeNames: 'col1',
      checkAll1: true,
      checkAll2: false,
      checkAll3: false,
      checkedItem1: [itemOptions1[0], itemOptions1[1]],
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
      listLoading: false
    }
  },
  computed: {
    listenSwitchs() {
      return this.$store.getters.switchs // 监听右表变化
    }
  },
  watch: {
    checkedItem1: {
      deep: true,
      handler(val) {
        this.$store.dispatch('S_SetCI1', this.checkedItem1) // 监听并更新全局变量
      }
    },
    checkedItem2: {
      deep: true,
      handler(val) {
        this.$store.dispatch('S_SetCI2', this.checkedItem2) // 监听并更新全局变量
      }
    },
    checkedItem3: {
      deep: true,
      handler(val) {
        this.$store.dispatch('S_SetCI3', this.checkedItem3) // 监听并更新全局变量
      }
    },
    radio1: {
      deep: true,
      handler(val) {
        this.$store.dispatch('S_SetRD1', this.radio1) // 监听并更新全局变量
      }
    },
    radio2: {
      deep: true,
      handler(val) {
        this.$store.dispatch('S_SetRD2', this.radio2) // 监听并更新全局变量
      }
    },
    listenSwitchs: {
      deep: true,
      handler(val) {
        API_GetSignals(
          val,
          this.$store.getters.checkedItem1,
          this.$store.getters.checkedItem2,
          this.$store.getters.checkedItem3
        )
          .then(response => {
            this.tableData = response.data // 监听右表变化更新左表值
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$store.dispatch('S_SetCI1', this.checkedItem1) // 初始化全局变量
      this.$store.dispatch('S_SetCI2', this.checkedItem2) // 初始化全局变量
      this.$store.dispatch('S_SetCI3', this.checkedItem3) // 初始化全局变量
      this.$store.dispatch('S_SetRD1', this.radio1) // 初始化全局变量
      this.$store.dispatch('S_SetRD2', this.radio2) // 初始化全局变量
    },
    onSubmit() {
      if (this.listLoading) {
        this.activeNames = 'col1'
        console.log('Loading...')
      } else {
        this.listLoading = true
        // console.log(this.$store.getters.checkedItem1);
        // console.log(this.$store.getters.checkedItem2);
        // console.log(this.$store.getters.checkedItem3);
        // console.log(this.$store.getters.radio1);
        // console.log(this.$store.getters.radio2);
        // console.log(this.$store.getters.switchs);
        API_GetSignals(
          this.$store.getters.switchs,
          this.$store.getters.checkedItem1,
          this.$store.getters.checkedItem2,
          this.$store.getters.checkedItem3
        )
          .then(response => {
            this.tableData = response.data // 手动更新左表值
            this.listLoading = false
            if (this.total === 0) {
              this.activeNames = 'col1'
            } else {
              this.activeNames = 'col1'
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
    },
    handleCheckAllChange2(val) {
      this.checkedItem2 = val ? itemOptions2 : []
      this.isIndeterminate2 = false
    },
    handleCheckAllChange3(val) {
      this.checkedItem3 = val ? itemOptions3 : []
      this.isIndeterminate3 = false
    },
    handleCheckedItemChange1(value) {
      const checkedCount = value.length
      this.checkAll1 = checkedCount === this.Items1.length
      this.isIndeterminate1 =
        checkedCount > 0 && checkedCount < this.Items1.length
    },
    handleCheckedItemChange2(value) {
      const checkedCount = value.length
      this.checkAll2 = checkedCount === this.Items2.length
      this.isIndeterminate2 =
        checkedCount > 0 && checkedCount < this.Items2.length
    },
    handleCheckedItemChange3(value) {
      const checkedCount = value.length
      this.checkAll3 = checkedCount === this.Items3.length
      this.isIndeterminate3 =
        checkedCount > 0 && checkedCount < this.Items3.length
    },
    cellRender(row, column, cellValue, index) {
      return formatTime(cellValue)
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #eee;color: #000;'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  margin: 3px;
  margin-right: 0px;
}
.el-form-item {
  margin: 0px;
}
.groupbt {
  float: right;
  margin-right: 5px;
  margin-top: 10px;
}
.el-table {
  width: 100%;
  margin-top: 12px;
}
</style>
