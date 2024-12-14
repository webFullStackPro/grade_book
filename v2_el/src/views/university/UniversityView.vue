<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="universityForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="学校名称">
            <el-input v-model="universityForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="成立日期">
            <el-input v-model="universityForm.establishmentDate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="universityForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱">
            <el-input v-model="universityForm.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="省/市/区">
            <el-cascader
                v-model="provinceCityArea"
                :options="provinceCityAreaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="地址">
            <el-input v-model="universityForm.location"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="学校简介">
            <el-input v-model="universityForm.universityDescription" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="universityForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="universityForm.modifyTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="12" :offset="6">
          <div class="form-button-container">
            <el-button @click="onBack" type="primary">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import universityApi from '@/api/universityApi'
import areas from "@/locales/area.json";
export default {
  name: 'UniversityView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      universityForm: {
      },
      provinceCityArea: [],
      provinceCityAreaOptions: areas.provinces
    }
  },
  created () {
    if (this.id) {
      universityApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.universityForm = resp.data
              this.provinceCityArea = []
              if (this.universityForm.province) {
                this.provinceCityArea.push(this.universityForm.province)
              }
              if (this.universityForm.city) {
                this.provinceCityArea.push(this.universityForm.city)
              }
              if (this.universityForm.area) {
                this.provinceCityArea.push(this.universityForm.area)
              }
            } else {
              this.$message.error('获取数据失败')
            }
          })
          .catch(error => {
            console.error('获取数据失败:', error)
          })
    }
  },
  methods: {
    onBack () {
      this.$emit('close-university-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>