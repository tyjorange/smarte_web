<template>
  <div class="root">
    <div class="col11">
      <sticky :z-index="10" :sticky-top="0" class-name="sub-navbar">
        <el-button type="primary" icon="el-icon-circle-plus" plain @click="sceneAddUpdate">增加</el-button>
        <el-button type="primary" icon="el-icon-refresh" plain @click="getScene">刷新</el-button>
      </sticky>
    </div>
    <!-- col_items -->
    <el-row v-for="item in sceneDataList" :key="item.id" class="col_items">
      <el-col :span="1" class="col21">
        <!--<SwitchComp :collector-code="item.code"/>-->
      </el-col>
      <el-col :span="2" class="col22"> <!-- scene item icon -->
        <img v-if="item.iconType === 0" class="images_eb" src="@/assets/changjing/huijia_cj.png" alt="">
        <img v-if="item.iconType === 1" class="images_eb" src="@/assets/changjing/lijia_cj.png" alt="">
        <img v-if="item.iconType === 2" class="images_eb" src="@/assets/changjing/qichuang_cj.png" alt="">
        <img v-if="item.iconType === 3" class="images_eb" src="@/assets/changjing/shuijiao_cj.png" alt="">
        <img v-if="item.iconType === 4" class="images_eb" src="@/assets/changjing/kaideng_cj.png" alt="">
        <img v-if="item.iconType === 5" class="images_eb" src="@/assets/changjing/guandeng_cj.png" alt="">
      </el-col>
      <el-col :span="4" class="col23"> <!-- scene item info -->
        <div class="name-card">
          <div class="text-item" effect="dark" placement="right-end">
            <el-button type="text">编码：{{ item.sceneID }}</el-button>
          </div>
          <div class="text-item" effect="dark" placement="right-end">
            <el-button type="text">场景名称：{{ item.name }}</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="3" class="col28"> <!-- collector is online -->
      </el-col>
      <el-col :span="8" class="col24"> <!-- collector item tools -->
        <el-button type="primary" icon="el-icon-set-up" plain @click.native.prevent="switchManager(item.collectorID)">
          关联({{ item.count }})条线路
        </el-button>
        <el-button type="primary" icon="el-icon-tickets" plain @click.native.prevent="sceneAddUpdate(item)">
          修改
        </el-button>
        <el-button type="success" icon="el-icon-video-play" plain @click.native.prevent="executeScene">
          执行
        </el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click.native.prevent="handleDel(item)">
          删除
        </el-button>
      </el-col>
    </el-row>
    <!-- hideForm -->
    <el-dialog :visible.sync="switchDialogVisible" title="线路管理" width="650px">
      <!--使用树形穿梭框组件-->
      <tree-transfer :title="title" :from_data="fromData" :to_data="toData" :default-props="{label:'label'}" :mode="mode" height="540px" filter open-all @addBtn="add" @removeBtn="remove"/>
      <!--<el-transfer-->
      <!--:titles="['我的电箱', '关联的电箱']"-->
      <!--:filter-method="filterMethod"-->
      <!--v-model="shareData"-->
      <!--:data="shareList"-->
      <!--:button-texts="['到左边', '到右边']"-->
      <!--filterable-->
      <!--filter-placeholder="请输入电箱名"/>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="switchDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sceneSwitchSubmit">确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- hideForm -->
    <el-dialog :visible.sync="configDialogVisible" title="添加/修改场景" width="600px">
      <el-form :model="configData">
        <el-form-item label-width="120px" label="场景名称">
          <el-input v-model="configData.name" auto-complete="off" style="width: 370px"/>
        </el-form-item>
        <el-form-item label-width="120px" label="场景图标">
          <el-button plain class="btn1" @click="iconSelect(0)">
            <img class="images_ebs" src="@/assets/changjing/huijia_cj.png" alt="">
            <p/>回家
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(1)">
            <img class="images_ebs" src="@/assets/changjing/lijia_cj.png" alt="">
            <p/>离家
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(2)">
            <img class="images_ebs" src="@/assets/changjing/qichuang_cj.png" alt="">
            <p/>起床
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(3)">
            <img class="images_ebs" src="@/assets/changjing/shuijiao_cj.png" alt="">
            <p/>睡觉
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(4)">
            <img class="images_ebs" src="@/assets/changjing/kaideng_cj.png" alt="">
            <p/>开灯
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(5)">
            <img class="images_ebs" src="@/assets/changjing/guandeng_cj.png" alt="">
            <p/>关灯
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(6)">
            <img class="images_ebs" src="@/assets/changjing/juhui_cj.png" alt="">
            <p/>聚会
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(7)">
            <img class="images_ebs" src="@/assets/changjing/youxi_cj.png" alt="">
            <p/>游戏
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(8)">
            <img class="images_ebs" src="@/assets/changjing/xiuxian_cj.png" alt="">
            <p/>休闲
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(9)">
            <img class="images_ebs" src="@/assets/changjing/gengduo_cj.png" alt="">
            <p/>其他
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeSceneSubmit">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky'
import treeTransfer from 'el-tree-transfer'
import { getToken } from '@/utils/auth'
import { API_getScene } from './api.js'
export default {
  name: 'Scene',
  components: { Sticky, treeTransfer },
  data() {
    // const generateUserListData = () => {
    //   const data = []
    //   const cities = ['卧室/201905060009gprs123', '客厅/201905060009gprs123', 'user3', 'user4', 'user5', 'user6', 'user7']
    //   const pinyin = ['卧室/201905060009gprs123', '客厅/201905060009gprs123', 'user3', 'user4', 'user5', 'user6', 'user7']
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
      title: ['我的电箱', '线路关联的电箱'],
      mode: 'transfer', // transfer addressList
      fromData: [
        {
          pid: 0,
          id: '1',
          label: '201905060009gprs123',
          children: [
            {
              pid: '1',
              id: '1-1',
              label: '卧室'
            },
            {
              pid: '1',
              id: '1-2',
              label: '客厅'
            }
          ]
        },
        {
          pid: 0,
          id: '2',
          label: '内网测试22',
          children: [
            {
              pid: '2',
              id: '2-1',
              label: '书房'
            },
            {
              pid: '2',
              id: '2-2',
              label: '照明'
            }
          ]
        }
      ],
      toData: [],
      // 树形穿梭框end
      configData: {
        name: '',
        iconType: ''
      },
      switchDialogVisible: false, // 场景下线路管理dialog可见性
      configDialogVisible: false, // 场景名称图片dialog可见性
      sceneDataList: [] // 从服务器获取的场景列表
      // shareList: generateUserListData(), // 从服务器获取的电箱列表（不含分享来的）
      // shareData: [] // 勾选的电箱列表（key list）
    }
  },
  mounted() {
    this.getScene()
  },
  methods: {
    // 修改场景提交 TODO
    changeSceneSubmit() {
      console.log(this.configData)
      // API_collectorBinding(getToken(), this.configData.code).then(response => {
      //   this.$message({
      //     type: response.data.code,
      //     message: response.data.message
      //   })
      //   this.configDialogVisible = false
      // }).catch(error => {
      //   this.configDialogVisible = false
      //   console.error(error)
      // })
    },
    // 场景关联的线路提交 TODO
    sceneSwitchSubmit() {
      // console.log(this.shareData)
      this.switchDialogVisible = false
    },
    // 打开场景下的线路管理dialog
    switchManager(id) {
      this.switchDialogVisible = true
      this.configData.collectorID = id
    },
    // 打开修改场景dialog
    sceneAddUpdate(item) {
      this.configData.name = item.name
      this.configDialogVisible = true
    },
    // 执行场景 TODO
    executeScene() {
      this.$message('execute')
    },
    // 打开删除场景dialog TODO
    handleDel(item) {
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
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
    // 获取场景列表
    getScene() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      API_getScene(getToken()).then(response => {
        if (response.data.code === 12) {
          this.$message('暂无数据')
        }
        this.sceneDataList = response.data.data
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
    // 场景图片修改赋值
    iconSelect(val) {
      console.log(val)
      this.configData.iconType = val
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

  .btn1 {
    width: 90px;
    margin-left: 0;
    margin-bottom: 5px;
  }
</style>
