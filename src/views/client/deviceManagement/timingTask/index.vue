<template>
  <div class="root">
    <div class="col11">
      <sticky class-name="sub-navbar">
        <el-button type="primary" icon="el-icon-refresh" plain>刷新</el-button>
      </sticky>
    </div>
    <!-- col_items -->
    <el-row v-for="item in gridData" :key="item.id" class="col_items">
      <el-col :span="1" class="col21">
        <el-popover placement="right-start" width="100%" trigger="click">
          <el-table :data="gridData">
            <el-table-column width="150" property="code" label="CODE"/>
            <el-table-column width="150" property="date" label="日期"/>
            <el-table-column width="100" property="name" label="姓名"/>
            <el-table-column width="300" property="type" label="类型"/>
          </el-table>
          <el-button slot="reference" icon="el-icon-plus" round/>
        </el-popover>
      </el-col>
      <el-col :span="3" class="col22">
        <div>
          <img :alt="item.code" class="images_eb" src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg">
        </div>
      </el-col>
      <el-col :span="4" class="col23">
        <div class="name-card">
          <el-tooltip :content="item.code" class="text-item" effect="dark" placement="right-end" >
            <el-button type="text">编码：{{ item.code }}</el-button>
          </el-tooltip>
          <el-tooltip :content="item.name" class="text-item" effect="dark" placement="right-end" >
            <el-button type="text">名字：{{ item.name }}</el-button>
          </el-tooltip>
          <el-tooltip :content="item.type" class="text-item" effect="dark" placement="right-end" >
            <el-button type="text">类型：{{ item.type }}</el-button>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="5" class="col24">
        <el-button type="primary" icon="el-icon-delete" plain @click.native.prevent="handleDel(item)">删除电箱</el-button>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :visible.sync="formDialogVisible" title="收货地址">
      <el-form :model="formData">
        <el-form-item label-width="120px" label="活动名称">
          <el-input v-model="formData.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label-width="120px" label="活动区域">
          <el-select v-model="formData.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky'
export default {
  name: 'ElectricBox',
  components: { Sticky },
  data() {
    return {
      formData: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formDialogVisible: false,
      gridData: [{
        id: 1,
        code: '2018042514381',
        date: '2016-05-02',
        name: '王小虎1',
        type: 'WIFI'
      }, {
        id: 2,
        code: '2018042514382',
        date: '2016-05-04',
        name: '王小虎2',
        type: 'WIFI'
      }, {
        id: 3,
        code: '2018042514383',
        date: '2016-05-01',
        name: '王小虎3',
        type: 'WIFI'
      }, {
        id: 4,
        code: '2018042514384',
        date: '2016-05-03',
        name: '王小虎4',
        type: 'WIFI'
      }, {
        id: 5,
        code: '2018042514385',
        date: '2016-05-03',
        name: '王小虎5',
        type: 'WIFI'
      }, {
        id: 6,
        code: '2018042514386',
        date: '2016-05-03',
        name: '王小虎6',
        type: 'WIFI'
      }, {
        id: 7,
        code: '2018042514387',
        date: '2016-05-03',
        name: '王小虎7',
        type: 'WIFI'
      }]
    }
  },
  methods: {
    handleShare(row) {
      this.$confirm('此操作将分享该电箱, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '分享成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消分享'
        })
      })
    },
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
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
  .root{
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
    min-width: 200px;
    margin-top: 10px;
  }
  .col23 {
    margin: 5px;
  }
  .col24 {
    min-width: 250px;
    margin: 60px;
  }
  .col_items {
    border-radius: 10px;
    margin: 0 5px 5px 5px;
    background-color: #c0c4cc5c;
  }
  .el-button--text{
    color: #656565;
  }
  .el-row{
    min-width: 1000px;
  }
  .name-card {
    float: left;
    width: 60px;
  }
  .text-item {
    margin: 5px;
  }
  .images_eb{
    border-radius: 10px;
    height:130px;
    width:100%;
  }
</style>
