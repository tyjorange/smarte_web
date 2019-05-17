<template>
  <div>
    <el-form ref="form" size="mini" label-width="0px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="数据项" name="col1">
          <template slot="title">数据选项
            <el-button-group class="groupbt">
              <el-button type="primary" size="mini" @click="onSubmit">刷新</el-button>
              <el-button type="primary" size="mini" @click="onSubmit">导出</el-button>
            </el-button-group>
          </template>
          <template>
            <el-form-item>时间范围：</el-form-item>
            <div class="block">
              <el-date-picker
                v-model="timeValue"
                :picker-options="pickerOptions2"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="left"
                size="mini"
              />
            </div>
            <el-form-item>费率类型：</el-form-item>
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
            <el-checkbox
              :indeterminate="isIndeterminate1"
              v-model="checkAll1"
              @change="handleCheckAllChange1"
            >电量：</el-checkbox>
            <el-checkbox-group v-model="checkedItem1" size="mini" @change="handleCheckAllChange1">
              <el-checkbox v-for="item in Items1" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>

            <el-checkbox
              :indeterminate="isIndeterminate2"
              v-model="checkAll2"
              @change="handleCheckAllChange2"
            >功率：</el-checkbox>
            <el-checkbox-group v-model="checkedItem2" size="mini" @change="handleCheckAllChange2">
              <el-checkbox v-for="item in Items2" :key="item.id" :label="item" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>

            <el-checkbox
              :indeterminate="isIndeterminate3"
              v-model="checkAll3"
              @change="handleCheckAllChange3"
            >其他：</el-checkbox>
            <el-checkbox-group v-model="checkedItem3" size="mini" @change="handleCheckAllChange3">
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
        style="width: 100%"
        size="small"
        border
        stripe
        highlight-current-row
        max-height="670"
      >
        <el-table-column type="index"/>
        <el-table-column prop="switchName" label="断路器" sortable width="120">
          <template slot-scope="scope">
            <span class="link-type" @click="handleOpen(scope.row)">{{ scope.row.switchName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectorName" label="集中器" sortable width="120"/>
        <el-table-column :formatter="cellRender" prop="dataTime" label="采集时间" sortable width="180"/>
        <el-table-column prop="fl" label="费率" width="100">
          <template slot-scope="scope">总</template>
        </el-table-column>
        <el-table-column
          v-for="item in formThead"
          :prop="item.id"
          :key="item.id"
          :label="item.name"
          align="right"
        />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="onSubmit"
      />
    </el-form>
    <el-dialog
      :visible.sync="dialogProp.dialogFormVisible"
      :before-close="handleClose"
      custom-class="customWidth"
      title
      width="79%"
    >
      <line-chart-dialog v-bind="dialogProp" fullscreen="true"/>
    </el-dialog>
  </div>
</template>

<script>
import { API_GetSignalsHis } from '../api.js'
import { formatTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import lineChartDialog from './LineChartDialog'
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
  components: { Pagination, lineChartDialog },
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
        limit: 20
      },
      dialogProp: {
        dialogFormVisible: false,
        tempRow: {}
      }
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
        if (val.length !== 0) {
          this.onSubmit() // 监听右表变化更新左表值
        }
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
        API_GetSignalsHis(
          this.$store.getters.switchs,
          this.$store.getters.checkedItem1,
          this.$store.getters.checkedItem2,
          this.$store.getters.checkedItem3,
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
            this.total = response.total
            this.listLoading = false
            if (this.total === 0) {
              this.activeNames = 'col1'
            } else {
              this.activeNames = ''
            }
          })
          .catch(error => {
            console.error(error)
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
    handleOpen(row) {
      this.dialogProp.tempRow = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp);
      // this.dialogStatus = "update";
      this.dialogProp.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    handleClose(done) {
      done()
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
.block {
  margin: 0px;
}
.el-form-item {
  margin: 0px;
}
.customWidth {
  margin-top: 0;
}
.groupbt {
  float: right;
  margin-right: 5px;
  margin-top: 10px;
}
.el-table {
  width: 100%;
  margin-top: 10px;
}
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
  &:hover {
    color: rgb(32, 160, 255);
  }
}
</style>
