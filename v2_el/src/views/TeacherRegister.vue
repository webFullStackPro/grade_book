<template>
  <div class="register-page">
    <div class="register">
      <div class="login__logo"></div>
      <div class="login__title">{{ $t('title') }}</div>
      <div class="login__subtitle">{{ $t('teacherRegisterTitle') }}</div>
      <el-form :model="registerForm" :rules="rules" ref="registerForm" @keyup.enter.native="onRegister" size="medium" :label-width="labelWidth">
        <el-row>
          <el-col :span="8">
            <el-form-item label="院系名称" prop="facultyName">
              <el-input v-model="registerForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="findFaculty"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="registerForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="registerForm.gender" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="密码" prop="password">
              <el-input v-model="registerForm.password" placeholder="请输入密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认密码" prop="password2">
              <el-input v-model="registerForm.password2" placeholder="请输入确认密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职称" prop="title">
              <el-select v-model="registerForm.title" placeholder="请选择职称">
                <el-option label="助教" :value="1"></el-option>
                <el-option label="讲师" :value="2"></el-option>
                <el-option label="副教授" :value="3"></el-option>
                <el-option label="教授" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="registerForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="教师简介" prop="profile">
              <el-input v-model="registerForm.profile" placeholder="请输入教师简介" maxlength="65535"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="verificationCode" label="验证码">
              <el-input v-model="registerForm.verificationCode" placeholder="请输入验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <canvas id="captchaCanvas" width="150" height="50" @click="drawCaptcha"></canvas>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-button type="primary" @click="onRegister" :loading="loading">注册</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onBack" :loading="loading">返回登录</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span><a href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a>
    </div>
    <el-dialog :visible.sync="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from '@/api/teacherApi'
import captchaMixin from "@/mixins/captchaMixin";
import FacultySelector from "@/views/faculty/FacultySelector.vue";
export default {
  name: 'TeacherRegister',
  components: {FacultySelector},
  mixins: [
    captchaMixin
  ],
  data () {
    return {
      registerForm: {
        facultyId: '',
        facultyName: '',
        name: '',
        password: '',
        password2: '',
        title: '',
        gender: 1,
        contactPhone: '',
        email: '',
        profile: '',
        verificationCode: ''
      },
      labelWidth: '80px',
      rules: {
        facultyName: [
          { required: true, message: '院系不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '职称不能为空', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      facultySelectorVisible: false
    }
  },
  created () {
  },
  methods: {
    onReset () {
      this.registerForm = {
        facultyId: '',
        facultyName: '',
        name: '',
        password: '',
        password2: '',
        title: '',
        gender: 1,
        contactPhone: '',
        email: '',
        profile: '',
        verificationCode: ''
      }
    },
    onRegister () {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          if (this.registerForm.password !== this.registerForm.password2) {
            this.$message.error('两次输入的密码不一致，请重新输入')
            this.registerForm.password = ''
            this.registerForm.password2 = ''
            this.refreshCaptcha()
            return
          }
          if (this.generatedVerificationCode.toLowerCase() !== this.registerForm.verificationCode.toLowerCase()) {
            this.$message.error('验证码错误')
            this.refreshCaptcha()
            return
          }
          this.loading = true
          // 登录验证
          teacherApi.save(this.registerForm)
              .then(data => {
                if (data.code === 1) {
                  this.$message.success('注册成功')
                  this.$router.push({ path: '/Login', query: {type: 2} })
                } else {
                  this.$message.error('注册失败:' + (data.msg ? data.msg : ''))
                  this.refreshCaptcha()
                  this.loading = false
                }
              })
              .catch(error => {
                console.log('注册失败', error)
                this.$message.error('注册失败')
                this.refreshCaptcha()
                this.loading = false
              })
        } else {
          this.refreshCaptcha()
          return false
        }
      })
    },
    refreshCaptcha () {
      this.registerForm.verificationCode = ''
      this.drawCaptcha()
    },
    findFaculty () {
      this.facultySelectorVisible = true
    },
    handleFacultySelectedEvent (selectedFaculty) {
      this.facultySelectorVisible = false
      if (selectedFaculty && 'facultyId' in selectedFaculty && this.registerForm.facultyId !== selectedFaculty['facultyId']) {
        this.registerForm.facultyId = selectedFaculty['facultyId']
        this.registerForm.facultyName = selectedFaculty['facultyName']
      }
    },
    onBack () {
      this.$router.push({ name: 'Login', query: {type: 2}})
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/register";
</style>
