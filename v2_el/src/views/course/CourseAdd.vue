<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="courseForm" :label-width="formLabelWidth" ref="refCourseForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系名称" prop="facultyName">
            <el-input v-model="courseForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findFaculty"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="教师姓名" prop="teacherName">
            <el-input v-model="courseForm.teacherName" placeholder="请选择教师姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findTeacher"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程代码" prop="code">
            <el-input v-model="courseForm.code" placeholder="请输入课程代码" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="courseForm.name" placeholder="请输入课程名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="学分" prop="credit">
            <el-input-number v-model="courseForm.credit" :min="1" :max="10"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="课程描述" prop="courseDescription">
            <el-input v-model="courseForm.courseDescription" placeholder="请输入课程描述" type="textarea" :rows="5" maxlength="65535"></el-input>
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
    <el-dialog :visible.sync="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
    <el-dialog :visible.sync="teacherSelectorVisible" v-if="teacherSelectorVisible" title="教师信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <teacher-selector @teacher-selected-event="handleTeacherSelectedEvent">
      </teacher-selector>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from '@/api/courseApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherSelector from "@/views/teacher/TeacherSelector.vue";
export default {
  name: 'CourseAdd',
  components: {FacultySelector,TeacherSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      courseForm: {
        facultyId: '',
        facultyName: '',
        teacherId: '',
        teacherName: '',
        code: '',
        name: '',
        credit: '',
        courseDescription: ''
      },
      rules: {
        facultyName: [
          { required: true, message: '请输入院系名称', trigger: 'blur' }
        ],
        teacherName: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入课程代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        credit: [
          { required: true, message: '请输入学分', trigger: 'blur' }
        ],
      },
      facultySelectorVisible: false,
      teacherSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      courseApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.courseForm = resp.data
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
      this.courseForm = {
        facultyId: '',
        facultyName: '',
        teacherId: '',
        teacherName: '',
        code: '',
        name: '',
        credit: '',
        courseDescription: ''
      }
      this.$emit('reset-course-add-event')
    },
    onSave () {
      this.$refs.refCourseForm.validate((valid) => {
        if (valid) {
          courseApi.save(this.courseForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-course-add-event', {search: true})
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
    findFaculty () {
      this.facultySelectorVisible = true
    },
    handleFacultySelectedEvent (selectedFaculty) {
      this.facultySelectorVisible = false
      if (selectedFaculty && 'facultyId' in selectedFaculty && this.courseForm.facultyId !== selectedFaculty['facultyId']) {
        this.courseForm.facultyId = selectedFaculty['facultyId']
        this.courseForm.facultyName = selectedFaculty['facultyName']
      }
    },
    findTeacher () {
      this.teacherSelectorVisible = true
    },
    handleTeacherSelectedEvent (selectedTeacher) {
      this.teacherSelectorVisible = false
      if (selectedTeacher && 'teacherId' in selectedTeacher && this.courseForm.teacherId !== selectedTeacher['teacherId']) {
        this.courseForm.teacherId = selectedTeacher['teacherId']
        this.courseForm.teacherName = selectedTeacher['teacherName']
      }
    },
    onBack () {
      this.$emit('close-course-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>