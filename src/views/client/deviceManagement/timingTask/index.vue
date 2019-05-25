<template>
  <div>
    <el-button class="addSwPop" icon="el-icon-circle-plus" type="primary" plain size="mini" @click="handleEdit">增加任务</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="执行时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span style="margin-left: 10px">{{ scope.row.timeValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行命令" width="180">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.cmd }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :formatter="repeatFormatter" label="重复" width="180">
        <!--<template slot-scope="scope">-->
        <!--<span style="margin-left: 10px">{{ scope.row.repeat }}</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column label="启用状态" width="180">
        <template slot-scope="scope">
          <el-button v-if="scope.row.enable === 1" type="success" icon="el-icon-check" circle/>
          <el-button v-if="scope.row.enable === 0" type="danger" icon="el-icon-close" circle/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- -->
    <el-dialog :visible.sync="timerDialogVisible" title="添加/修改定时任务" width="700px">
      <el-form :model="configData">
        <el-form-item label-width="120px" label="执行时间:">
          <el-time-picker v-model="configData.timeValue" placeholder="请选择执行时间点" value-format="HH:mm:ss"/>
        </el-form-item>
        <el-form-item label-width="120px" label="执行命令:">
          <el-radio v-model="configData.cmd" label="1">线路开</el-radio>
          <el-radio v-model="configData.cmd" label="2">线路关</el-radio>
        </el-form-item>
        <el-form-item label-width="120px" label="启用状态:">
          <el-switch v-model="configData.enable" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label-width="120px" label="驻留集中器:">
          <el-tooltip placement="top">
            <div slot="content">驻留集中器<br>驻留集中器</div>
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-checkbox v-model="configData.checked1"/>
        </el-form-item>
        <el-form-item label-width="120px" label="重复|每周:">
          <el-checkbox-group ref="mygroup" v-model="checkboxGroup1" @change="handleChange">
            <el-checkbox-button v-for="day in weekday" :label="day" :key="day.name" :checked="day.checked">{{ day.name }}</el-checkbox-button>0
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="timerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handSubmit">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from 'vue'
// const dayOptions = ['日', '一', '二', '三', '四', '五', '六']
const dayOptions = [
  { name: '周日' },
  { name: '周一' },
  { name: '周二' },
  { name: '周三' },
  { name: '周四' },
  { name: '周五' },
  { name: '周六' }
]
export default {
  data() {
    return {
      weekday: dayOptions,
      checkboxGroup1: [],
      configData: {
        timeValue: '',
        cmd: '',
        checked1: true, // 驻留
        enable: 0
      },
      timerDialogVisible: false, // dialog可见性
      tableData: [
        {
          timeValue: '08:00',
          cmd: '开',
          repeat: '123',
          checked1: true, // 驻留
          enable: 1
        }, {
          timeValue: '13:30',
          cmd: '关',
          repeat: '246',
          checked1: false, // 驻留
          enable: 0
        }, {
          timeValue: '18:30',
          cmd: '开',
          repeat: '357',
          checked1: true, // 驻留
          enable: 1
        }, {
          timeValue: '21:45',
          cmd: '关',
          repeat: '1234567',
          checked1: false, // 驻留---------------------------------------------
          enable: 1
        }]
    }
  },
  methods: {
    handleEdit(rowIndex, row) {
      // console.log(rowIndex % 2 === 0, row)
      this.checkboxGroup1 = []
      for (let index = 0; index < this.weekday.length; index++) {
        if (rowIndex % 2 === 0) {
          this.checkboxGroup1.push(this.weekday[index])
        }
        // this.weekday[index].checked = rowIndex % 2 === 0
        // const tempObj = this.weekday[index]
        // Vue.set(this.weekday, index, tempObj)
        // this.weekday.splice(index, 1, tempObj)
      }
      // const self = this
      // setTimeout(function() {
      //   const arr = self.$refs.mygroup.$children
      //   for (let index = 0; index < arr.length; index++) {
      //     arr[index].checked = (rowIndex % 2 === 0)
      //     console.log(arr[index].checked)
      //   }
      // }, 500)//
      // console.log(this.weekday)
      this.timerDialogVisible = true
    },
    handleDelete(index, row) {
      // console.log(index, row)
    },
    handSubmit() {
      console.log(this.configData)
    },
    handleChange() {
      console.log(this.checkboxGroup1)
    },
    repeatFormatter(row, column, cellValue, index) {
      console.log(row.repeat, cellValue, column, index)
      return '<el-tag>标签一</el-tag>'
    }
  }
}
</script>
