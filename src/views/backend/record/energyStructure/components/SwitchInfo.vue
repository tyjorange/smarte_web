<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="断路器名称">
      <el-col :span="11">
        <el-input v-model="form.name"/>
      </el-col>
      <el-col :span="11" style="margin-left: 20px;">
        <el-form-item label="集中器">
          <el-select v-model="form.collectorid" placeholder="请选择集中器">
            <el-option v-for="item in collectorList" :key="item.collectorid" :label="item.name" :value="item.collectorid"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label="断路器编码">
      <el-col :span="11">
        <el-input v-model="form.code"/>
      </el-col>
      <el-col :span="11" style="margin-left: 20px;">
        <el-form-item label="采集频率">
          <el-input-number v-model="form.frequency" :min="1" controls-position="right"/>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label="断路器性质">
      <el-col :span="11">
        <el-select v-model="form.nature" placeholder="请选择断路器性质">
          <el-option label="生产" value="0"/>
          <el-option label="生活" value="1"/>
        </el-select>
      </el-col>
      <el-col :span="11" style="margin-left: 20px;">
        <el-form-item label="断路器状态">
          <el-select v-model="form.state" placeholder="请选择断路器状态">
            <el-option label="停用" value="0"/>
            <el-option label="运行" value="1"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item style="text-align: center;margin:20px auto; ">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="dialogFormVisible = false">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { API_GetCollectors } from '@/api/record/energyStructure'

export default {
  data() {
    return {
      form: {
        name: '',
        collectorid: '',
        nature: '1',
        state: '1',
        energyType: '0',
        type: [],
        frequency: 1
      },
      collectorList: []
    }
  },
  mounted: function() {
    this.getCollectors()
  },
  methods: {
    getCollectors() {
      API_GetCollectors(this.$store.getters.token)
        .then(response => {
          this.collectorList = response.data // 下拉树数据
        })
        .catch(error => {
          console.log(error)
        })
    },
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style>
</style>
