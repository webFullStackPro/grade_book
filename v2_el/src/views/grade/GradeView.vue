<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="gradeForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程名称">
            <el-input v-model="gradeForm.courseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学号">
            <el-input v-model="gradeForm.studentNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="成绩">
            <el-input v-model="gradeForm.grade"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="gradeForm.createTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="gradeForm.modifyTime"></el-input>
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
import gradeApi from '@/api/gradeApi'
export default {
  name: 'GradeView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      gradeForm: {
      }
    }
  },
  created () {
    if (this.id) {
      gradeApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.gradeForm = resp.data
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
      this.$emit('close-grade-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>