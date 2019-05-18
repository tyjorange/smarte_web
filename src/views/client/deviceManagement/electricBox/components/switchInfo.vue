<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="线路详情" name="first">
      <el-row>
        <el-col :span="6">
          <el-progress
            :percentage="25"
            :stroke-width="strokeWidth"
            :width="circleWidth"
            type="circle"
            status="text"
            color="#8e71c7">当前总功率<p>13kw</p></el-progress>
          <el-progress
            :percentage="55"
            :stroke-width="strokeWidth"
            :width="circleWidth"
            type="circle"
            status="text"
            color="#00FA9A">电流<p>12A</p></el-progress>
          <el-progress
            :percentage="85"
            :stroke-width="strokeWidth"
            :width="circleWidth"
            type="circle"
            status="text"
            color="#FFD700">电压<p>15V</p></el-progress>
          <div class="grid-content bg-purple"/>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light"/>
          <el-row>设备编码 {{ switchCode }}</el-row>
          <el-row>累计用电</el-row>
          <el-row>当月用电</el-row>
          <el-row>当月无功电量</el-row>
          <el-row>功率因数</el-row>
          <el-row>温度</el-row>
          <el-row>无功电量</el-row>
          <el-row>无功功率</el-row>
          <el-row>有功功率</el-row>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="过流设置" name="second">
      <div class="block">
        <span class="demonstration">设置线路的最大承受电流，保护线路用电安全</span>
        <p/>
        <el-radio v-model="guoliu" :label="16">16A</el-radio>
        <el-radio v-model="guoliu" :label="20">20A</el-radio>
        <el-radio v-model="guoliu" :label="25">25A</el-radio>
        <el-radio v-model="guoliu" :label="32">32A</el-radio>
        <el-radio v-model="guoliu" :label="63">63A</el-radio>
      </div>
      <el-button class="cbtn" type="primary" @click="commitSet(1)">确 定</el-button>
    </el-tab-pane>
    <el-tab-pane label="过压设置" name="third">
      <div class="block">
        <span class="demonstration">过压值</span>
        <p/>
        <el-slider
          v-model="guoya"
          :min="guoyaMin"
          :max="guotaMax"
          show-input/>
      </div>
      <el-button class="cbtn" type="primary" @click="commitSet(2)">确 定</el-button>
    </el-tab-pane>
    <el-tab-pane label="欠压设置" name="fourth">
      <div class="block">
        <span class="demonstration">欠压值</span>
        <p/>
        <el-slider
          v-model="qianya"
          :min="qianyaMin"
          :max="qianyaMax"
          show-input/>
      </div>
      <el-button class="cbtn" type="primary" @click="commitSet(3)">确 定</el-button>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: 'SwitchInfoComponents',
  props: {// 父组件传值
    switchCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      guoliu: 25,
      guoya: 0,
      guoyaMin: 250,
      guotaMax: 380,
      qianya: 0,
      qianyaMin: 50,
      qianyaMax: 180,
      strokeWidth: 15,
      circleWidth: 120,
      activeName: 'first'
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    dopen() {
      // open
    },
    resetTabPane() {
      this.activeName = 'first'
    },
    commitSet(type) {
      console.log(type)
      console.log(this.guoliu)
      console.log(this.guoya)
      console.log(this.qianya)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #pieChart1 {
    width: 530px;
    height: 300px;
  }

  .component-item {
    min-height: 360px;
  }

  .cbtn {
    margin: 5px 20px 5px 20px;
    float: right;
  }

  .block {
    margin: 5px 20px 5px 20px;
  }
</style>
