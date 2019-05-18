<template>
  <div class="root">
    <div class="col11">
      <sticky class-name="sub-navbar">
        <el-button type="primary" icon="el-icon-circle-plus" plain @click="formDialogVisible = true">增加电箱</el-button>
        <el-button type="primary" icon="el-icon-refresh" plain @click="getCollector">刷新</el-button>
      </sticky>
    </div>
    <!-- col_items -->
    <el-row v-for="item in collectorData" :key="item.id" class="col_items">
      <el-col :span="1" class="col21"> <!-- switches item pop -->
        <SwitchComp :collector-code="item.code"/>
      </el-col>
      <el-col :span="2" class="col22"> <!-- collector item icon -->
        <div v-if="item.beShared === 1">
          <img class="images_eb" src="@/assets/changjing/jzq-jinlai.png">
        </div>
        <div v-else-if="item.beShared === 0">
          <img v-if="item.share === 0" class="images_eb" src="@/assets/changjing/jzq.png" alt="">
          <img v-else-if="item.share > 0" class="images_eb" src="@/assets/changjing/jzq-chuqu.png" alt="">
        </div>
      </el-col>
      <el-col :span="4" class="col23"> <!-- collector item info -->
        <div class="name-card">
          <div class="text-item" effect="dark" placement="right-end">
            <el-button type="text">编码：{{ item.code }}</el-button>
          </div>
          <div class="text-item" effect="dark" placement="right-end">
            <el-button type="text">智能电箱：{{ item.name }}</el-button>
          </div>
          <div class="text-item" effect="dark" placement="right-end">
            <el-button v-if="item.ioType === 0" type="text">IO类型：未知</el-button>
            <el-button v-else-if="item.ioType === 1" type="text">通讯类型：GPRS</el-button>
            <el-button v-else-if="item.ioType === 2" type="text">通讯类型：WIFI</el-button>
            <el-button v-else-if="item.ioType === 3" type="text">通讯类型：ETH</el-button>
            <el-button v-else-if="item.ioType === 4" type="text">通讯类型：MB</el-button>
            <el-button v-else-if="item.ioType === 5" type="text">通讯类型：RoLa</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="3" class="col28"> <!-- collector is online -->
        <el-button type="text">当前状态：</el-button>
        <el-tooltip
          :content="'最后在线时间：' + dateFormat(item.activeTime.time)"
          class="text-item"
          effect="dark"
          placement="right-end">
          <!--<img v-if="item.active == 0" class="images_ebs" src="@/assets/zaixianzhuangtai0.png">-->
          <el-button v-if="item.active === 0" type="danger" icon="el-icon-close" round>离线</el-button>
          <!--<img v-else-if="item.active == 1" class="images_ebs" src="@/assets/zaixianzhuangtai1.png">-->
          <el-button v-else-if="item.active === 1" type="success" icon="el-icon-check" round>在线</el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="5" class="col24"> <!-- collector item tools -->
        <el-button type="primary" icon="el-icon-tickets" plain @click.native.prevent="handleConfig(item.collectorID)">
          配置电箱
        </el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click.native.prevent="handleDel(item.collectorID)">
          删除电箱
        </el-button>
      </el-col>
    </el-row>
    <!-- hideForm -->
    <el-dialog :visible.sync="formDialogVisible" title="增加电箱" width="600px">
      <el-form :model="formAddData">
        <el-form-item label-width="120px" label="设备编码：">
          <el-input v-model="formAddData.code" style="width: 350px;" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCollectorBinding(formAddData.code)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- hideForm -->
    <el-dialog :visible.sync="configDialogVisible" title="配置电箱" width="600px">
      <el-form :model="configData">
        <el-form-item label-width="120px" label="设备名称：">
          <el-input v-model="configData.name" auto-complete="off" style="width: 350px"/>
        </el-form-item>
        <el-form-item label-width="120px" label="波特率">
          <el-select v-model="configData.bote" placeholder="请选择" style="width: 350px">
            <el-option label="2400bps" value="2400"/>
            <el-option label="4800bps" value="4800"/>
            <el-option label="9600bps" value="6900"/>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="采集频率">
          <el-select v-model="configData.pinglv" placeholder="请选择" style="width: 350px">
            <el-option label="10min" value="10"/>
            <el-option label="15min" value="15"/>
            <el-option label="20min" value="20"/>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="采集阀值">
          <el-select v-model="configData.fazhi" placeholder="请选择" style="width: 350px">
            <el-option label="10%" value="10"/>
            <el-option label="15%" value="15"/>
            <el-option label="20%" value="20"/>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="心跳间隔">
          <el-select v-model="configData.xintiao" placeholder="请选择" style="width: 350px">
            <el-option label="90s" value="90"/>
            <el-option label="120s" value="120"/>
            <el-option label="150s" value="150"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="collectorConfig(configData.name,configData.enable,configData.collectorID)">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky'
import SwitchComp from './components/switches'
import { getToken } from '@/utils/auth'
import { API_getCollector, API_collectorBinding } from './api.js'

export default {
  name: 'ElectricBox',
  components: { Sticky, SwitchComp },
  data() {
    return {
      formAddData: {
        name: '',
        region: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      configData: {
        name: '',
        bote: '',
        pinglv: '',
        fazhi: '',
        xintiao: ''
      },
      formDialogVisible: false,
      configDialogVisible: false,
      collectorData: []
    }
  },
  mounted() {
    this.getCollector()
  },
  methods: {
    // 集中器配置提交
    collectorConfig(username, enables, collectorID) {
      // API_collectorShare(getToken(), collectorID, username, enables).then(response => {
      //   this.$message({
      //     type: response.data.code,
      //     message: response.data.message
      //   })
      //   this.configDialogVisible = false
      // }).catch(error => {
      //   console.error(error)
      //   this.configDialogVisible = false
      // })
    },
    // 打开配置dialog
    handleConfig(id) {
      this.configDialogVisible = true
      this.configData.collectorID = id
    },
    // 打开删除dialog
    handleDel(row) {
      this.$confirm('此操作将永久删除该电箱, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取集中器列表
    getCollector() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      API_getCollector(getToken()).then(response => {
        this.collectorData = response.data.data
        loading.close()
      }).catch(error => {
        loading.close()
        console.error(error)
      })
    },
    // 绑定（添加）集中器
    getCollectorBinding(collectorCode) {
      API_collectorBinding(getToken(), collectorCode).then(response => {
        this.$message({
          type: response.data.code,
          message: response.data.message
        })
        this.formAddData.code = ''
        this.formDialogVisible = false
      }).catch(error => {
        this.formDialogVisible = false
        console.error(error)
      })
    },
    // 时间格式化
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .root {
    min-width: 1500px;
    background: url(../../../../assets/main.jpg) no-repeat fixed;
  }

  .col11 {
    min-height: 50px;
    padding-left: 5px;
  }

  .col21 {
    min-width: 70px;
    margin-left: 15px;
    margin-top: 60px;
  }

  .col22 {
    text-align: center;
    min-width: 102px;
    margin-top: 10px;
  }

  .col23 {
    min-width: 250px;
    margin: 5px;
  }

  .col24 {
    float: right;
    text-align: right;
    min-width: 250px;
    margin: 60px 15px 60px 30px;
  }

  .col28 {
    min-width: 250px;
    margin: 60px 5px 5px;
  }

  .dialog-footer {
    margin-right: 30px;
  }

  .col_items {
    border-radius: 10px;
    margin: 0 5px 5px 5px;
    background-color: #c0c4cc5c;
  }

  .el-button--text {
    color: #656565;
  }

  .el-row {
    min-width: 1000px;
  }

  .name-card {
    float: left;
    width: 60px;
  }

  .text-item {
    margin: 5px;
  }

  .images_eb {
    margin-top: 15px;
    border-radius: 10px;
    height: 102px;
    width: 102px;
  }

  .images_ebs {
    margin-top: 5px;
    border-radius: 10px;
    height: 25px;
    width: 25px;
  }
</style>
