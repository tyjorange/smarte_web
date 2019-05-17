<template>
  <el-row>
    <el-col :span="18">
      <div class="grid-content">
        <table-left />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content">
        <table-right />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import tableLeft from './components/tableLeft'
import tableRight from './components/tableRight'
export default {
  components: { tableLeft, tableRight }
}
</script>

<style>
</style>
