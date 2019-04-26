<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span
        v-for="role in roles"
        :key="role"
      > {{ role }} </span></div>
    <div class="dashboard-text">permissions:<span
        v-for="permission in permissions"
        :key="permission"
      > {{ permission }} </span></div> -->
    <div>
      <el-row :gutter="0">
        <el-col :span="8">
          <el-card :body-style="{ padding: '10px' }" class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title"><i class="el-icon-date"/>能耗日历</span>
            </div>
            <div class="component-item">
              <calendar-view/>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '10px' }" class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title"><i class="el-icon-document"/>能耗用途统计</span>
            </div>
            <div class="component-item">
              <pie-chart/>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '10px' }" class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title"><i class="el-icon-mobile-phone"/>设备总览</span>
            </div>
            <div class="component-item">
              <dev-count/>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-card :body-style="{ padding: '10px' }" class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title"><i class="el-icon-printer"/>能耗分类</span>
            </div>
            <div class="component-item">
              <bar-chart1/>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card :body-style="{ padding: '10px' }" class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title"><i class="el-icon-printer"/>纵向能耗同比</span>
            </div>
            <div class="component-item">
              <bar-chart2/>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-card :body-style="{ padding: '10px' }" class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title"><i class="el-icon-printer"/>横向能耗同比</span>
            </div>
            <div class="component-item">
              <bar-chart3/>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card :body-style="{ padding: '10px' }" class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title"><i class="el-icon-bell"/>告警事件通知</span>
            </div>
            <div class="component-item">
              <alarmView/>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import calendarView from './components/CalendarView'
import pieChart from './components/PieChart'
import devCount from './components/DevCount'
import barChart1 from './components/BarChart1'
import barChart2 from './components/BarChart2'
import barChart3 from './components/BarChart3'
import alarmView from './components/AlarmView'

export default {
  name: 'Dashboard',
  components: {
    calendarView,
    pieChart,
    devCount,
    barChart1,
    barChart2,
    barChart3,
    alarmView
  }, computed: {
    ...mapGetters(['name', 'roles', 'permissions'])
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .el-row {
    margin-bottom: 0px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 9px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 9px;
    min-height: 554px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #174196;
  }

  .component-item {
    min-height: 360px;
  }

  .card-title {
    font-size: 20px;
    color: green;
  }
</style>
