<template>
  <div>
    <el-popover
      :ref="'popover-' + collectorCode"
      placement="right-start"
      width="100%"
      trigger="manual"
      @show="popShow">
      <el-button class="closePop" icon="el-icon-close" size="mini" @click="popClose(collectorCode)"/>
      <el-table :data="gridData" :class="'pop'+collectorCode" max-height="400">
        <el-table-column width="100" property="iconType" label="图标">
          <template slot-scope="scope">
            <img v-if="scope.row.iconType === 0" class="images_ebs" src="@/assets/xianlu/linepic01@3x.png" alt="">
            <img v-if="scope.row.iconType === 1" class="images_ebs" src="@/assets/xianlu/linepic02@3x.png" alt="">
            <img v-if="scope.row.iconType === 2" class="images_ebs" src="@/assets/xianlu/linepic03@3x.png" alt="">
            <img v-if="scope.row.iconType === 3" class="images_ebs" src="@/assets/xianlu/linepic04@3x.png" alt="">
            <img v-if="scope.row.iconType === 4" class="images_ebs" src="@/assets/xianlu/linepic05@3x.png" alt="">
            <img v-if="scope.row.iconType === 5" class="images_ebs" src="@/assets/xianlu/linepic06@3x.png" alt="">
            <img v-if="scope.row.iconType === 6" class="images_ebs" src="@/assets/xianlu/linepic07@3x.png" alt="">
            <img v-if="scope.row.iconType === 7" class="images_ebs" src="@/assets/xianlu/linepic08@3x.png" alt="">
            <img v-if="scope.row.iconType === 8" class="images_ebs" src="@/assets/xianlu/linepic09@3x.png" alt="">
            <img v-if="scope.row.iconType === 9" class="images_ebs" src="@/assets/xianlu/linepic10@3x.png" alt="">
          </template>
        </el-table-column>
        <el-table-column width="150" property="code" label="CODE"/>
        <el-table-column width="150" property="name" label="线路名称"/>
        <!--<el-table-column width="100" property="switchID" label="switchID"/>-->
        <!--<el-table-column width="100" property="sequence" label="sequence"/>-->
        <!--<el-table-column width="100" property="state" label="state"/>-->
        <el-table-column width="350" label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onChangeState"/>
            <el-button
              size="mini"
              plain
              @click="handleEditInfo(scope.$index, scope.row)">
              <i class="el-icon-edit"/> 编辑
            </el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">
              <i class="el-icon-delete"/> 删除
            </el-button>
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleDetail(scope.$index, scope.row)">
              <i class="el-icon-document"/> 查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button slot="reference" icon="el-icon-plus" round @click="popToggle(collectorCode)"/>
    </el-popover>
    <!-- Form -->
    <el-dialog :visible.sync="swithcEditVisible" title="修改线路" append-to-body width="600px">
      <el-form :model="switchData">
        <el-form-item label-width="120px" label="线路名称">
          <el-input v-model="switchData.name" auto-complete="off" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label-width="120px" label="线路图片">
          <el-button plain class="btn1" @click="iconSelect(0)">
            <img class="images_ebs" src="@/assets/xianlu/linepic01@3x.png" alt="">
            <p/>照明
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(1)">
            <img class="images_ebs" src="@/assets/xianlu/linepic02@3x.png" alt="">
            <p/>客厅
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(2)">
            <img class="images_ebs" src="@/assets/xianlu/linepic03@3x.png" alt="">
            <p/>主卧
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(3)">
            <img class="images_ebs" src="@/assets/xianlu/linepic04@3x.png" alt="">
            <p/>卧室
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(4)">
            <img class="images_ebs" src="@/assets/xianlu/linepic05@3x.png" alt="">
            <p/>书房
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(5)">
            <img class="images_ebs" src="@/assets/xianlu/linepic06@3x.png" alt="">
            <p/>电脑
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(6)">
            <img class="images_ebs" src="@/assets/xianlu/linepic07@3x.png" alt="">
            <p/>厨房
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(7)">
            <img class="images_ebs" src="@/assets/xianlu/linepic08@3x.png" alt="">
            <p/>卫生间
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(8)">
            <img class="images_ebs" src="@/assets/xianlu/linepic09@3x.png" alt="">
            <p/>空调
          </el-button>
          <el-button plain class="btn1" @click="iconSelect(9)">
            <img class="images_ebs" src="@/assets/xianlu/linepic10@3x.png" alt="">
            <p/>其他
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="swithcEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- hideForm -->
    <el-dialog
      :visible.sync="switchInfoVisible"
      :close-on-click-modal="onEscClose"
      :close-on-press-escape="onEscClose"
      title="数据信息"
      append-to-body
      @open="dialogOpen"
      @close="dialogClose">
      <switch-info ref="mychild" :switch-code="toChildVal"/>
    </el-dialog>
  </div>
</template>
<script>
import SwitchInfo from './switchInfo'
import { getToken } from '@/utils/auth'
import { API_getSwitchByCollector } from '../api.js'

export default {
  name: 'SwitchComponents',
  components: { SwitchInfo },
  props: {// 父组件传的值
    collectorCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      gridData: [],
      swithcEditVisible: false,
      switchInfoVisible: false,
      onEscClose: true, // 是否允许遮罩和ESC关闭
      toChildVal: '',
      switchData: {
        name: '',
        icons: ''
      }
    }
  },
  mounted() {
    this.getSwitch()
  },
  methods: {
    // 获取线路列表
    getSwitch() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        target: document.querySelector('.pop' + this.collectorCode), // 局部loading层
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      API_getSwitchByCollector(getToken(), this.collectorCode).then(response => {
        this.gridData = response.data.data
        loading.close()
      }).catch(error => {
        loading.close()
        console.error(error)
      })
    },
    // 打开线路详细dialog回调
    dialogOpen() {
      const self = this
      setTimeout(function() {
        self.$refs.mychild.dopen()
      }, 500)// 等子组件生成再调用dopen
    },
    // 关闭线路详细dialog回调
    dialogClose() {
      const self = this
      setTimeout(function() {
        self.$refs.mychild.resetTabPane()
      }, 500)// 等子组件生成再调用resetTabPane
    },
    // 打开、关闭pop层
    popToggle(id) {
      this.$refs[`popover-` + id].doToggle()
    },
    // 关闭pop层
    popClose(id) {
      this.$refs[`popover-` + id].doClose()
    },
    // pop层渲染完成回调
    popShow() {
      this.getSwitch()
    },
    // 开、关线路
    onChangeState(value) {
      console.log('onChangeState ' + value)
      if (value) {
        this.$message('打开')
      } else {
        this.$message('关闭')
      }
    },
    // 修改线路名称、图标
    onSubmitInfo() {
      this.$message('修改成功')
      this.swithcEditVisible = false
    },
    // 打开修改线路dialog
    handleEditInfo(index, row) {
      this.swithcEditVisible = true
    },
    // 打开删除线路dialog
    handleDelete(index, row) {
      this.$confirm('此操作解除线路绑定, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '解除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解除'
        })
      })
    },
    // 打开修改线路详细dialog
    handleDetail(index, row) {
      this.switchInfoVisible = true
      this.toChildVal = row.code
    },
    // 线路图片修改赋值
    iconSelect(val) {
      console.log(val)
      this.switchData.icons = val
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .images_ebs {
    margin-top: 5px;
    border-radius: 10px;
    height: 35px;
    width: 35px;
  }

  .el-select-dropdown__item {
    height: 50px;
  }

  .el-switch {
    margin-right: 10px;
  }

  .keepInline {
    margin: 10px;
    border: 0;
    padding: 0;
  }

  .closePop {
    float: right
  }

  .dialog-footer {
    margin-right: 30px;
  }

  .btn1 {
    width: 90px;
    margin-left: 0;
    margin-bottom: 5px;
  }
</style>
