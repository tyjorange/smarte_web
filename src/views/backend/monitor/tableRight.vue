<template>
  <div>
    <el-form ref="form" size="small" label-width="0px">
      <el-form-item>
        <el-cascader
          :options="opt1"
          v-model="selectedOptions2"
          expand-trigger="hover"
          placeholder="输入名称搜索集中器/断路器"
          clearable
          filterable
          @change="handleChange"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="value1" placeholder="能源类别" clearable>
          <el-option v-for="item in opt2" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-table
          ref="multipleTable"
          :data="tableData3"
          :header-cell-style="tableHeaderColor"
          style="width: 100%"
          size="small"
          border
          stripe
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="39"/>
          <el-table-column prop="name" label="断路器"/>
          <el-table-column prop="collectorid" label="集中器"/>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_GetCollectors, API_GetSwitchs } from '@/api/monitor/realdata'
export default {
  data() {
    return {
      tableData3: [],
      opt1: [],
      opt2: [
        {
          value: '1',
          label: '电力'
        },
        {
          value: '2',
          label: '水'
        },
        {
          value: '3',
          label: '热能'
        },
        {
          value: '4',
          label: '蒸汽'
        }
      ],
      value1: '1',
      selectedOptions2: []
    }
  },
  watch: {
    tableData3: {
      deep: true,
      handler(val) {
        this.$refs.multipleTable.toggleAllSelection()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      API_GetCollectors(this.$store.getters.token)
        .then(response => {
          this.opt1 = response.data // 下拉菜单数据
          this.handleChange(this.selectedOptions2) // 获取集中器数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$store.dispatch('S_SetSWS', this.multipleSelection) // 列表变化 更新全局变量
    },
    handleChange(value) {
      API_GetSwitchs(value[1])
        .then(response => {
          this.tableData3 = response.data
        })
        .catch(error => {
          console.log(error)
        })
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
.el-cascader {
  width: 100%;
}
.el-select {
  width: 100%;
}
.el-form-item {
  display: inline;
  margin: 0px;
}
.el-input {
  float: left;
}
.el-button-group {
  margin-left: 0px;
  margin-right: 0px;
}
.groupbt {
  float: right;
}
</style>
