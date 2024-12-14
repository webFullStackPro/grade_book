<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="attendanceForm" :label-width="formLabelWidth" ref="refAttendanceForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="attendanceForm.courseName" placeholder="请选择课程名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findCourse"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学生学号" prop="studentNumber">
            <el-input v-model="attendanceForm.studentNumber" placeholder="请选择学生学号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStudent"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="考勤日期" prop="attendanceDate">
            <el-date-picker
                v-model="attendanceForm.attendanceDate" type="date" placeholder="考勤日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态" prop="status">
            <el-select v-model="attendanceForm.status" placeholder="请选择状态">
              <el-option label="出勤" :value="10"></el-option>
              <el-option label="缺勤" :value="20"></el-option>
              <el-option label="迟到" :value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="courseSelectorVisible" v-if="courseSelectorVisible" title="课程信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <course-selector @course-selected-event="handleCourseSelectedEvent">
      </course-selector>
    </el-dialog>
    <el-dialog :visible.sync="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
  </div>
</template>

<script>
import attendanceApi from '@/api/attendanceApi'
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
export default {
  name: 'AttendanceAdd',
  components: {CourseSelector,StudentSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      attendanceForm: {
        courseId: '',
        courseName: '',
        studentId: '',
        studentNumber: '',
        attendanceDate: '',
        status: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        studentNumber: [
          { required: true, message: '请输入学生学号', trigger: 'blur' }
        ],
        attendanceDate: [
          { required: true, message: '请输入考勤日期', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
      },
      courseSelectorVisible: false,
      studentSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      attendanceApi.findById(Number(this.id))
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
    onReset () {
      this.attendanceForm = {
        courseId: '',
        courseName: '',
        studentId: '',
        studentNumber: '',
        attendanceDate: '',
        status: ''
      }
      this.$emit('reset-attendance-add-event')
    },
    onSave () {
      this.$refs.refAttendanceForm.validate((valid) => {
        if (valid) {
          attendanceApi.save(this.attendanceForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-attendance-add-event', {search: true})
              } else {
                this.$message.error('保存失败:' + (resp.msg ? resp.msg : ''))
              }
            })
            .catch(error => {
              console.log(error)
              this.$message.error('保存失败')
            })
        } else {
          return false
        }
      })
    },
    findCourse () {
      this.courseSelectorVisible = true
    },
    handleCourseSelectedEvent (selectedCourse) {
      this.courseSelectorVisible = false
      if (selectedCourse && 'courseId' in selectedCourse && this.attendanceForm.courseId !== selectedCourse['courseId']) {
        this.attendanceForm.courseId = selectedCourse['courseId']
        this.attendanceForm.courseName = selectedCourse['courseName']
      }
    },
    findStudent () {
      this.studentSelectorVisible = true
    },
    handleStudentSelectedEvent (selectedStudent) {
      this.studentSelectorVisible = false
      if (selectedStudent && 'studentId' in selectedStudent && this.attendanceForm.studentId !== selectedStudent['studentId']) {
        this.attendanceForm.studentId = selectedStudent['studentId']
        this.attendanceForm.studentNumber = selectedStudent['studentNumber']
      }
    },
    onBack () {
      this.$emit('close-attendance-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>