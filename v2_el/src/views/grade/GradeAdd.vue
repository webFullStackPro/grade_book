<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="gradeForm" :label-width="formLabelWidth" ref="refGradeForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="gradeForm.courseName" placeholder="请选择课程名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findCourse"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学生学号" prop="studentNumber">
            <el-input v-model="gradeForm.studentNumber" placeholder="请选择学生学号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStudent"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="成绩" prop="grade">
            <el-input-number v-model="gradeForm.grade" :precision="2" :step="0.1" :min="1" :max="999"></el-input-number>
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
import gradeApi from '@/api/gradeApi'
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
export default {
  name: 'GradeAdd',
  components: {CourseSelector,StudentSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      gradeForm: {
        courseId: '',
        courseName: '',
        studentId: '',
        studentNumber: '',
        grade: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        studentNumber: [
          { required: true, message: '请输入学生学号', trigger: 'blur' }
        ],
      },
      courseSelectorVisible: false,
      studentSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      gradeApi.findById(Number(this.id))
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
    onReset () {
      this.gradeForm = {
        courseId: '',
        courseName: '',
        studentId: '',
        studentNumber: '',
        grade: ''
      }
      this.$emit('reset-grade-add-event')
    },
    onSave () {
      this.$refs.refGradeForm.validate((valid) => {
        if (valid) {
          gradeApi.save(this.gradeForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-grade-add-event', {search: true})
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
      if (selectedCourse && 'courseId' in selectedCourse && this.gradeForm.courseId !== selectedCourse['courseId']) {
        this.gradeForm.courseId = selectedCourse['courseId']
        this.gradeForm.courseName = selectedCourse['courseName']
      }
    },
    findStudent () {
      this.studentSelectorVisible = true
    },
    handleStudentSelectedEvent (selectedStudent) {
      this.studentSelectorVisible = false
      if (selectedStudent && 'studentId' in selectedStudent && this.gradeForm.studentId !== selectedStudent['studentId']) {
        this.gradeForm.studentId = selectedStudent['studentId']
        this.gradeForm.studentNumber = selectedStudent['studentNumber']
      }
    },
    onBack () {
      this.$emit('close-grade-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>