<template>
  <div class="root">
    <el-tabs :tab-position="tabPosition" type="border-card" stretch @tab-click="tabClick">
      <el-tab-pane>
        <el-row slot="label" class="tabLabel">
          <el-col :span="8">
            <img class="images_eb" src="@/assets/changjing/jzq.png" alt="">
          </el-col>
          <el-col :span="10">
            <div class="text-item">
              <el-row type="text">编码：123</el-row>
            </div>
            <div class="text-item">
              <el-row type="text">智能电箱：aassee</el-row>
            </div>
          </el-col>
        </el-row>
        <div class="tabContent">用户管理</div>
      </el-tab-pane>
      <el-tab-pane>
        <el-row slot="label" class="tabLabel">
          <el-col :span="8">
            <img class="images_eb" src="@/assets/changjing/jzq.png" alt="">
          </el-col>
          <el-col :span="10">
            <div class="text-item">
              <el-row type="text">编码：123</el-row>
            </div>
            <div class="text-item">
              <el-row type="text">智能电箱：aassee</el-row>
            </div>
          </el-col>
        </el-row>
        <div class="tabContent">用户管理</div>
      </el-tab-pane>
      <el-tab-pane>
        <el-row slot="label" class="tabLabel">
          <el-col :span="8">
            <img class="images_eb" src="@/assets/changjing/jzq.png" alt="">
          </el-col>
          <el-col :span="10">
            <div class="text-item">
              <el-row type="text">编码：123</el-row>
            </div>
            <div class="text-item">
              <el-row type="text">智能电箱：aassee</el-row>
            </div>
          </el-col>
        </el-row>
        <div class="tabContent">用户管理</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabPosition: 'left'
    }
  },
  methods: {
    tabClick(tabItem) {
      console.log(tabItem)
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
  .root {
    min-width: 100%;
    min-height: 845px;
    background: url(../../../../assets/main.jpg) no-repeat fixed;
  }
  .el-tabs{
    height: 845px;
    padding: 15px;
  }
  .el-tabs /deep/ .el-tabs__item {
    padding: 0 !important;
    width: 250px !important;
    height: auto !important;
  }
  .el-tabs--left /deep/ .el-tabs__item.is-left {
    text-align: left;
  }
  .images_eb {
    margin-top: 5px;
    border-radius: 10px;
    height: 100px;
    width: 100px;
  }
  .text-item {
    margin: 10px;
  }
</style>
