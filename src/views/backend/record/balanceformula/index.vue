<template>
  <el-row>
    <el-col :span="24">
      <div class="grid-content">
        <table-left />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import tableLeft from './components/tableLeft'
export default {
  components: { tableLeft }
}
</script>

<style lang="scss" scoped>
.grid-content {
  border-radius: 9px;
  min-height: 300px;
  margin: 2px;
}
</style>
