<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="teacherForm" :label-width="formLabelWidth" ref="refTeacherForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系名称" prop="facultyName">
            <el-input v-model="teacherForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findFaculty"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="teacherForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="密码" prop="password">
            <el-input v-model="teacherForm.password" placeholder="请输入密码" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="职称" prop="title">
            <el-select v-model="teacherForm.title" placeholder="请选择职称">
              <el-option label="助教" :value="1"></el-option>
              <el-option label="讲师" :value="2"></el-option>
              <el-option label="副教授" :value="3"></el-option>
              <el-option label="教授" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="teacherForm.gender" placeholder="请选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="teacherForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="teacherForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="教师简介" prop="profile">
            <el-input v-model="teacherForm.profile" placeholder="请输入教师简介" type="textarea" :rows="5" maxlength="65535"></el-input>
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
  </div>
</template>

<script>
import teacherApi from '@/api/teacherApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
export default {
  name: 'TeacherAdd',
  components: {FacultySelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      teacherForm: {
        facultyId: '',
        facultyName: '',
        name: '',
        password: '',
        title: '',
        gender: '',
        contactPhone: '',
        email: '',
        profile: ''
      },
      rules: {
        facultyName: [
          { required: true, message: '请输入院系名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
      },
      facultySelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      teacherApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.teacherForm = resp.data
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
      this.teacherForm = {
        facultyId: '',
        facultyName: '',
        name: '',
        password: '',
        title: '',
        gender: '',
        contactPhone: '',
        email: '',
        profile: ''
      }
      this.$emit('reset-teacher-add-event')
    },
    onSave () {
      this.$refs.refTeacherForm.validate((valid) => {
        if (valid) {
          teacherApi.save(this.teacherForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-teacher-add-event', {search: true})
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
      if (selectedFaculty && 'facultyId' in selectedFaculty && this.teacherForm.facultyId !== selectedFaculty['facultyId']) {
        this.teacherForm.facultyId = selectedFaculty['facultyId']
        this.teacherForm.facultyName = selectedFaculty['facultyName']
      }
    },
    onBack () {
      this.$emit('close-teacher-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>