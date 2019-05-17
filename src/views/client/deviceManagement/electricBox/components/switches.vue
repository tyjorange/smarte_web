<template>
  <div>
    <el-popover :ref="'popover-' + collectorCode" placement="right-start" width="100%" trigger="manual" @show="popShow">
      <el-button class="closePop" icon="el-icon-close" size="mini" @click="pClose(collectorCode)"/>
      <el-table :data="gridData" :class="'pop'+collectorCode">
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
        <el-table-column width="100" property="name" label="线路名称"/>
        <!--<el-table-column width="100" property="switchID" label="switchID"/>-->
        <!--<el-table-column width="100" property="sequence" label="sequence"/>-->
        <!--<el-table-column width="100" property="state" label="state"/>-->
        <el-table-column width="320" label="操作">
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
              @click="handleEditInfo(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleDetail(scope.$index, scope.row)">
              查看
              <i class="el-icon-arrow-right el-icon--right"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button slot="reference" icon="el-icon-plus" round @click="pOpen(collectorCode)"/>
    </el-popover>
    <!-- Form -->
    <el-dialog :visible.sync="swithcEditVisible" title="修改线路" append-to-body>
      <el-form :model="switchData">
        <el-form-item label-width="120px" label="线路名称">
          <el-input v-model="switchData.name" style="width: 450px;" auto-complete="off"/>
        </el-form-item>
        <el-form-item label-width="120px" label="线路图片">
          <el-select v-model="switchData.icons" placeholder="请选择图片" style="width: 450px;">
            <el-option label="图1" value="1"/>
            <el-option label="图2" value="2"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="swithcEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- Form -->
    <el-dialog :visible.sync="switchInfoVisible" :close-on-click-modal="onEscClose" :close-on-press-escape="onEscClose" title="详细信息" append-to-body>
      <switch-info :switch-code="toDialogVal"/>
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
  props: {// 父组件传值
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
      onEscClose: false, // 不允许遮罩和ESC关闭
      toDialogVal: '',
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
        console.error(error)
      })
    },
    pOpen(id) {
      this.$refs[`popover-` + id].doShow()
    },
    pClose(id) {
      this.$refs[`popover-` + id].doClose()
    },
    popShow() {
      this.getSwitch()
    },
    onChangeState(value) {
      console.log('onChangeState ' + value)
      if (value) {
        this.$message('打开')
      } else {
        this.$message('关闭')
      }
    },
    onSubmitInfo() {
      this.$message('修改成功')
      this.swithcEditVisible = false
    },
    handleEditInfo(index, row) {
      this.swithcEditVisible = true
    },
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
    handleDetail(index, row) {
      this.switchInfoVisible = true
      this.toDialogVal = row.code
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

  .el-switch {
    margin-right: 10px;
  }

  .keepInline {
    margin: 10px;
    border: 0;
    padding: 0;
  }
  .closePop{
    float:right
  }
</style>
