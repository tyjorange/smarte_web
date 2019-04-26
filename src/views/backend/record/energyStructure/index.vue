<!-- 用能结构 -->
<template>
  <section style="padding: 10px;">
    <el-row style="padding: 10px 20px;">
      <el-col :span="6">
        <template>
          <el-select v-model="value" placeholder="能源种类" size="mini" style="width:300px;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
        <el-tree
          ref="collectorTree"
          :data="collectorList"
          :props="defaultProps"
          accordion
          node-key="id"
          style="margin-top: 10px;"
          @node-click="getSwiths"/>
      </el-col>
      <el-col :span="18" style="float:right;">
        <div style="margin-bottom: 10px;">
          <el-input v-model="input_collector" placeholder="请输入计量点名称/通讯地址" size="mini" style="width:300px"/>
          <span style="float:right;">
            <el-button type="primary" size="mini" @click="dialogFormVisible=true">新增计量点</el-button>
            <el-button type="primary" size="mini">修改计量点</el-button>
            <el-button type="primary" size="mini">删除计量点</el-button>
            <el-button type="primary" size="mini">查询</el-button>
            <el-button type="primary" size="mini">导出</el-button>
          </span>
        </div>
        <template>
          <el-table
            v-loading="listLoading"
            ref="multipleTable"
            :data="tableData"
            :header-cell-style="tableHeaderColor"
            stripe
            border
            highlight-current-row
            style="width: 100%"
            size="mini"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.1)">
            <el-table-column type="selection" width="50"/>
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column prop="switchName" label="计量点名称" width="180"/>
            <el-table-column prop="collectorName" label="用能单位" width="180"/>
            <el-table-column :formatter="formatState" prop="state" label="状态"/>
            <el-table-column prop="energyType" label="能源种类"/>
            <el-table-column prop="collectorName" label="采集终端"/>
            <el-table-column prop="collectorCode" label="终端地址"/>
          </el-table>
        </template>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogFormVisible" title="断路器信息">
      <switch-info />
    </el-dialog>

  </section>
</template>

<script>
import {
  // API_GetCollectors,
  API_GetCollectorTree,
  API_getAllSwitchs,
  API_GetSwitchs
} from '@/api/record/energyStructure'

import switchInfo from './components/SwitchInfo'

export default {
  components: { switchInfo },
  data() {
    return {
      options: [
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
          label: '热水'
        },
        {
          value: '4',
          label: '热能'
        },
        {
          value: '5',
          label: '天然气'
        },
        {
          value: '6',
          label: '蒸汽'
        },
        {
          value: '7',
          label: '无烟煤'
        },
        {
          value: '8',
          label: '汽油'
        },
        {
          value: '9',
          label: '柴油'
        }
      ],
      value: '',
      input_collector: '',
      collectorList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      dialogFormVisible: false,
      listLoading: false
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    init() {
      API_GetCollectorTree(this.$store.getters.token)
        .then(response => {
          this.collectorList = response.data // 下拉树数据
        })
        .catch(error => {
          console.log(error)
        })

      API_getAllSwitchs(this.$store.getters.token)
        .then(response => {
          this.tableData = response.data // 右边表格数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSwiths(data) {
      API_GetSwitchs(data.id)
        .then(response => {
          this.tableData = response.data // 右边表格数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    formatState(row, column, cellValue, index) {
      if (cellValue === 0) {
        return '停用'
      } else if (cellValue === 1) {
        return '运行'
      }
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

<style>
.el-table__fixed-footer-wrapper tbody td {
  border-top: 1px solid #ebeef5;
  background-color: #dff0d8;
  color: #606266;
}
.el-table__footer-wrapper tbody td {
  background-color: #dff0d8;
  color: #606266;
}
.el-table th {
  text-align: center;
}
.el-button + .el-button {
  margin-left: 0px;
}
.el-table td:first-child {
  text-align: center;
}
.el-tree-node__children {
  max-height: 400px;
  overflow: auto;
}
.el-tree-node > .el-tree-node__children {
  overflow: auto;
  background-color: transparent;
}
</style>
