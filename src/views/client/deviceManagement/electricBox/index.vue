<template>
  <div class="root">
    <div class="col11">
      <sticky :z-index="10" :sticky-top="0" class-name="sub-navbar">
        <el-button type="primary" icon="el-icon-circle-plus" plain @click="formDialogVisible = true">增加</el-button>
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
            <el-button v-if="item.beShared === 0" type="text">编码：{{ item.code }}</el-button>
            <el-button v-if="item.beShared === 1" type="text">编码：{{ item.code }}【{{ item.ownerUser.username }}分享的电箱】</el-button>
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
      <el-col :span="8" class="col24"> <!-- collector item tools -->
        <el-button v-if="item.beShared === 0" type="primary" icon="el-icon-share" plain @click.native.prevent="handleShare(item)">
          共享({{ item.share }})
        </el-button>
        <el-button v-if="item.beShared === 1" type="primary" icon="el-icon-share" plain disabled>
          共享
        </el-button>
        <el-button v-if="item.beShared === 0" type="primary" icon="el-icon-tickets" plain @click.native.prevent="handleConfig(item)">
          配置
        </el-button>
        <el-button v-if="item.beShared === 1" type="primary" icon="el-icon-tickets" plain disabled>
          配置
        </el-button>
        <el-button v-if="item.beShared === 0" type="danger" icon="el-icon-delete" plain @click.native.prevent="handleDel(item)">
          删除
        </el-button>
        <el-button v-if="item.beShared === 1" type="danger" icon="el-icon-delete" plain disabled>
          删除
        </el-button>
      </el-col>
    </el-row>
    <!-- hideForm -->
    <el-dialog :visible.sync="formDialogVisible" title="增加电箱" width="600px">
      <el-form :model="collectorAddData">
        <el-form-item label-width="120px" label="设备编码：">
          <el-input v-model="collectorAddData.code" style="width: 350px;" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="collectorBindingSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- hideForm -->
    <el-dialog :visible.sync="shareDialogVisible" title="共享管理" width="650px">
      <!--使用树形穿梭框组件-->
      <tree-transfer :title="title" :from_data="fromData" :to_data="toData" :default-props="{label:'label'}" :mode="mode" height="540px" filter open-all @addBtn="add" @removeBtn="remove"/>
      <!--<el-transfer-->
      <!--:titles="['所有用户', '被分享的用户']"-->
      <!--:filter-method="filterMethod"-->
      <!--v-model="shareData"-->
      <!--:data="shareList"-->
      <!--:button-texts="['到左边', '到右边']"-->
      <!--filterable-->
      <!--filter-placeholder="请输入用户名"/>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="shareDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shareSubmit">确 定
        </el-button>
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
        <el-button type="primary" @click="collectorConfigSubmit">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky'
import treeTransfer from 'el-tree-transfer'
import SwitchComp from './components/switchesPopover'
import { getToken } from '@/utils/auth'
import { API_getCollector, API_collectorBinding } from './api.js'

export default {
  name: 'ElectricBox',
  components: { Sticky, treeTransfer, SwitchComp },
  data() {
    // const generateUserListData = () => {
    //   const data = []
    //   const cities = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7']
    //   const pinyin = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7']
    //   cities.forEach((city, index) => {
    //     data.push({
    //       label: city,
    //       key: index,
    //       pinyin: pinyin[index]
    //     })
    //   })
    //   console.log(data)// 服务器转来的数据转成的el-transfer所需格式 TODO
    //   return data
    // }
    return {
      // 树形穿梭框start
      title: ['所有用户', '被分享的用户'],
      mode: 'transfer', // transfer addressList
      fromData: [
        {
          pid: 0,
          id: '1',
          label: '201905060009gprs123'
        },
        {
          pid: 0,
          id: '2',
          label: '内网测试22'
        }
      ],
      toData: [],
      // 树形穿梭框end
      collectorAddData: {// 添加电箱表单值
        code: ''
      },
      configData: {// 配置电箱表单值
        collectorID: '',
        name: '',
        bote: '',
        pinglv: '',
        fazhi: '',
        xintiao: ''
      },
      formDialogVisible: false, // 添加dialog可见性
      shareDialogVisible: false, // 共享dialog可见性
      configDialogVisible: false, // 配置dialog可见性
      collectorData: [] // 从服务器获取的电箱列表
      // shareList: generateUserListData(), // 从服务器获取的可被分享的用户列表
      // shareData: [] // 勾选的被分享用户列表（key list）
    }
  },
  mounted() {
    this.getCollector()
  },
  methods: {
    // 集中器绑定（添加）提交 TODO
    collectorBindingSubmit() {
      API_collectorBinding(getToken(), this.collectorAddData.code).then(response => {
        this.$message({
          type: response.data.code,
          message: response.data.message
        })
        this.formDialogVisible = false
      }).catch(error => {
        this.formDialogVisible = false
        console.error(error)
      })
    },
    // 共享集中器数据提交 TODO
    shareSubmit() {
      // console.log(this.shareData)
      this.shareDialogVisible = false
    },
    // 集中器配置提交 TODO
    collectorConfigSubmit() {
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
      console.log(this.configData)
      this.configDialogVisible = false
    },
    // 打开分享电箱dialog
    handleShare(item) {
      this.shareDialogVisible = true
      this.configData.collectorID = item.collectorID
    },
    // 打开配置电箱dialog
    handleConfig(item) {
      this.configDialogVisible = true
      this.configData.collectorID = item.collectorID
      this.configData.name = item.name
    },
    // 打开删除电箱dialog TODO
    handleDel(item) {
      this.$confirm('此操作将永久删除该电箱, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: item.name + ' 删除成功!'
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
        if (response.data.code === 12) {
          this.$message('暂无数据')
        }
        this.collectorData = response.data.data
        loading.close()
      }).catch(error => {
        loading.close()
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
    },
    // 分享dialog的自定义搜索方法
    filterMethod(query, item) {
      return item.pinyin.indexOf(query) > -1
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .root {
    min-width: 1500px;
    min-height: 800px;
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
  .el-tabs__item {
    padding: 0 20px;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
  }
  .el-button--text {
    color: #656565;
  }

  .el-row {
    min-width: 1000px;
  }

  .el-transfer {
    margin-left: 35px
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
