<!-- 企业信息 -->
<template>
  <section style="padding: 10px;">
    <el-button type="primary" size="mini" style="margin: 10px;float:right;" @click="dialogFormVisible = true">添加</el-button>

    <!--地图容器-->
    <div id="myMap" class="myMap"/>

    <!-- Form -->
    <el-dialog :visible.sync="dialogFormVisible" title="企业信息" width="70%" style="margin-top: -5vh;">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="企业名称" prop="name">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="ruleForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="企业简称" prop="shortName">
              <el-input v-model="ruleForm.shortName"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="所属地区">
          <el-col :span="11">
            <el-select v-model="ruleForm.province" placeholder="请选择省份">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
            <el-select v-model="ruleForm.city" placeholder="请选择活动城市">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="ruleForm.industry" placeholder="请选择所属行业">
                <el-option label="第一产业" value="shanghai"/>
                <el-option label="第二产业" value="beijing"/>
                <el-option label="第三产业（服务业）" value="beijing"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="联系人" prop="linkman">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="ruleForm.linkman"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="ruleForm.phone"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="企业类型">
          <el-col :span="11">
            <el-select v-model="ruleForm.enterpriseType" placeholder="请选择企业类型">
              <el-option label="园林能效" value="1"/>
            </el-select>
          </el-col>
          <el-col :span="11">
            <el-form-item label="企业类别" prop="businessCategory">
              <el-select v-model="ruleForm.businessCategory" placeholder="请选择企业类别">
                <el-option label="国家监管" value="1"/>
                <el-option label="省级监管" value="2"/>
                <el-option label="各地市监管" value="3"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="ruleForm.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="主要经营活动" prop="activities">
              <el-input v-model="ruleForm.activities"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="法人代表" prop="email">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="ruleForm.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="注册地址" prop="activities">
              <el-input v-model="ruleForm.activities"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="营业执照注册号" prop="email">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="ruleForm.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="生产地址" prop="activities">
              <el-input v-model="ruleForm.activities"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="东经E" prop="email">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="ruleForm.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="北纬N" prop="activities">
              <el-input v-model="ruleForm.activities"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="企业等级">
          <el-col :span="11">
            <el-select v-model="ruleForm.enterpriseType" placeholder="请选择企业等级">
              <el-option label="顶级公司" value="1"/>
              <el-option label="子公司" value="1"/>
            </el-select>
          </el-col>
        </el-form-item>

        <!-- <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>
// 导入BMap组件
import BMap from 'BMap'

// var dialogFormVisible

export default {
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        shortName: '',
        province: '',
        city: '',
        industry: '',
        linkman: '',
        phone: '',
        enterpriseType: '1',
        businessCategory: '3',
        email: '',
        activities: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    var map = new BMap.Map('myMap')
    var point = new BMap.Point(121.25509, 30.791498)
    map.centerAndZoom(point, 15)
    map.addControl(new BMap.MapTypeControl())
    map.enableScrollWheelZoom(true)
    map.enableDoubleClickZoom(true)
    var marker = new BMap.Marker(point)
    map.addOverlay(marker)

    map.centerAndZoom(point, 15)

    marker.addEventListener('click', function() {
      alert('您点击了标注')
      // dialogFormVisible = true
    })

    // 百度地图API功能
    var sContent =
      "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>上海永继电气股份有限公司</h4>" +
      "<p style='margin:0;line-height:1.5;font-size:13px;'>地址：上海市金山区金山卫镇金石南路2239号</p>"

    var infoWindow = new BMap.InfoWindow(sContent) // 创建信息窗口对象
    map.openInfoWindow(infoWindow, point) // 开启信息窗口

    infoWindow.addEventListener('click', function() {
      alert('您点击了窗口')
    })
  }
}
</script>
<style scoped>
html,
body,
.myMap {
  width: 100%;
  height: 850px;
  overflow: hidden;
  margin: 0;
  font-family: "微软雅黑";
}
.el-form-item__content {
  margin-left: 0;
}
</style>
