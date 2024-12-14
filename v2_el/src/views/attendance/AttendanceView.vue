<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="attendanceForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程名称">
            <el-input v-model="attendanceForm.courseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学号">
            <el-input v-model="attendanceForm.studentNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="考勤日期">
            <el-input v-model="attendanceForm.attendanceDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态">
            <el-select v-model="attendanceForm.status" placeholder="请选择状态">
              <el-option label="出勤" :value="10"></el-option>
              <el-option label="缺勤" :value="20"></el-option>
              <el-option label="迟到" :value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="attendanceForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="attendanceForm.modifyTime"></el-input>
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
import attendanceApi from '@/api/attendanceApi'
export default {
  name: 'AttendanceView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      attendanceForm: {
      }
    }
  },
  created () {
    if (this.id) {
      attendanceApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.attendanceForm = resp.data
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
      this.$emit('close-attendance-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>