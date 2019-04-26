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
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="left"
                size="mini"/>
            </div>
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
        <el-table-column prop="fl" label="费率" min-width="30"/>
        <el-table-column prop="qm" label="起码" align="right" sortable/>
        <el-table-column prop="zm" label="止码" align="right" sortable/>
        <el-table-column prop="bl" label="倍率" min-width="30"/>
        <el-table-column prop="dataValue" label="电量" align="right" sortable/>
        <el-table-column prop="qmsj" label="起码时间" sortable/>
        <el-table-column prop="zmsj" label="止码时间" sortable/>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { API_PointUsed } from '@/api/monitor/pointused'
import { formatTime } from '@/utils/index'
const itemOptions1 = [
  { id: 'wgdl', name: '无功电量' },
  { id: 'ygdl', name: '有功电量' }
]
export default {
  data() {
    return {
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
      checkedItem1: [itemOptions1[0]],
      isIndeterminate1: false,
      Items1: itemOptions1,
      radio1: 1,
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
    radio1: {
      deep: true,
      handler(val) {
        this.$store.dispatch('S_SetRD1', this.radio1) // 监听并更新全局变量
      }
    },
    listenSwitchs: {
      deep: true,
      handler(val) {
        API_PointUsed(val, this.$store.getters.checkedItem1, this.timeValue)
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
      this.$store.dispatch('S_SetRD1', this.radio1) // 初始化全局变量
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
        API_PointUsed(
          this.$store.getters.switchs,
          this.$store.getters.checkedItem1,
          this.timeValue
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
    handleCheckedItemChange1(value) {
      const checkedCount = value.length
      this.checkAll1 = checkedCount === this.Items1.length
      this.isIndeterminate1 =
        checkedCount > 0 && checkedCount < this.Items1.length
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
