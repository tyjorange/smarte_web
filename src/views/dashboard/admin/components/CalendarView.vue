<template>
  <div>
    <el-col :span="16">
      <calendar @choseDay="clickDay" @changeMonth="changeDate"/>
    </el-col>
    <el-col :span="8">
      <el-card :body-style="{ padding: '10px' }" class="box-card1" shadow="never">
        <div slot="header" class="text-head">
          <span>日用电量</span>
        </div>
        <div class="text-item">{{ rydl }} kWh</div>
      </el-card>
      <el-card :body-style="{ padding: '10px' }" class="box-card1" shadow="never">
        <div slot="header" class="text-head">
          <span>月用电量</span>
        </div>
        <div class="text-item">{{ yydl }} kWh</div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import calendar from '@/components/Calendar'
import { API_GetCalendarData } from '@/api/dashboard'
export default {
  components: {
    calendar
  },
  data() {
    return {
      fullscreenLoading: false,
      rydl: '0.00',
      yydl: '0.00'
    }
  },
  mounted() {
    this.getCalendarData(new Date())
  },
  methods: {
    getCalendarData(mTime) {
      const loading = this.$loading({
        text: '查询中',
        background: 'rgba(0, 0, 0, 0.1)',
        target: document.querySelector('.component-item')
      })
      API_GetCalendarData(mTime)
        .then(response => {
          this.rydl = response.data.rydl === 'nu' ? '--' : response.data.rydl
          this.yydl = response.data.yydl === 'nu' ? '--' : response.data.yydl
          loading.close()
        })
        .catch(error => {
          console.log(error)
        })
    },
    clickDay(data) {
      this.getCalendarData(new Date(data))
    },
    changeDate(data) {
      console.log('d ' + data) // 左右点击切换月份
    },
    clickToday(data) {
      console.log('b ' + data) // 跳到了本月
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card1 {
  margin-top: 20px;
}
.text-head {
  text-align: center;
  font-size: 18px;
  color: black;
  background-color: #fff;
}
.text-item {
  text-align: center;
}
</style>

