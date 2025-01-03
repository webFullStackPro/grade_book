<template>
  <div class="login-page">
    <div class="login">
      <div class="login__logo"></div>
      <div class="login__title">{{ $t('title') }}</div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" @keyup.enter.native="onLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <el-input v-model="loginForm.verificationCode" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <canvas id="captchaCanvas" width="150" height="50" @click="drawCaptcha"></canvas>
        </el-form-item>
        <el-form-item prop="type">
          <el-radio-group v-model="loginForm.type" @change="handleTypeChange">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="2">教师</el-radio>
            <el-radio :label="3">学生</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="loginForm.type === 1">
          <el-button type="primary" @click="onLogin" class="login__btn" :loading="loading">登录</el-button>
        </el-form-item>
        <el-form-item v-if="loginForm.type === 2">
          <el-button type="primary" @click="onLogin" class="login__btn" :loading="loading">登录</el-button>
          <el-button type="primary" @click="onTeacherRegister" class="login__btn" :loading="loading">注册</el-button>
        </el-form-item>
        <el-form-item v-if="loginForm.type === 3">
          <el-button type="primary" @click="onLogin" class="login__btn" :loading="loading">登录</el-button>
          <el-button type="primary" @click="onStudentRegister" class="login__btn" :loading="loading">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span><a href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/userApi'
import captchaMixin from "@/mixins/captchaMixin";
import {ADMIN_USERNAME, PASSWORD, STUDENT_USERNAME, TEACHER_USERNAME} from "@/const";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  mixins: [
    captchaMixin
  ],
  data () {
    return {
      loginForm: {
        username: ADMIN_USERNAME,
        password: PASSWORD,
        verificationCode: '',
        type: 1
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    if (this.$route.query.type) {
      this.loginForm.type = Number(this.$route.query.type)
    }
  },
  methods: {
    onLogin () {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          if (this.generatedVerificationCode.toLowerCase() !== this.loginForm.verificationCode.toLowerCase()) {
            this.$message.error('验证码错误')
            this.handleTypeChange()
            return
          }
          this.loading = true
          // 登录验证
          userApi.login(this.loginForm)
            .then(resp => {
              if (resp && resp.code === 1) {
                this.$message.success('登录成功')
                const lt = resp.data
                sessionStorage.setItem('loginToken', lt.token)
                sessionStorage.setItem('type', lt.type)
                sessionStorage.setItem('uid', lt.uid)
                sessionStorage.setItem('username', lt.username)
                this.$router.replace({ path: '/Home' })
              } else {
                this.$message.error(resp && resp.msg ? resp.msg : '登录失败，用户名或密码不正确')
                this.handleTypeChange()
                this.loading = false
              }
            })
            .catch(error => {
              console.log('登录失败', error)
              this.$message.error('登录失败，用户名或密码错误')
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
      this.loginForm.verificationCode = ''
      this.drawCaptcha()
    },
    onTeacherRegister () {
      this.$router.push({ name: 'TeacherRegister' })
    },
    onStudentRegister () {
      this.$router.push({ name: 'StudentRegister' })
    },
    handleTypeChange () {
      this.refreshCaptcha()
      this.loginForm.verificationCode = ''
      if (this.loginForm.type === 1) {
        this.loginForm.username = ADMIN_USERNAME
        this.loginForm.password = PASSWORD
        return
      }
      if (this.loginForm.type === 2) {
        this.loginForm.username = TEACHER_USERNAME
        this.loginForm.password = PASSWORD
        return
      }
      if (this.loginForm.type === 3) {
        this.loginForm.username = STUDENT_USERNAME
        this.loginForm.password = PASSWORD
      }
    }
  }
}
</script>

<style lang="scss">
@import "../assets/styles/var";

.login-page {
  width: 100vw;
  height: 100vh;
  padding-top: 60px;
  background-color: $primary-color;
}

.login {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  box-shadow: 0 0 8px 0 $box-shadow-base;
  border-radius: 6px;

  div {
    text-align: center;
  }

  @at-root #{&}__logo {
    img {
      width: 30%;
    }
  }

  @at-root #{&}__title {
    margin: 10px 0;
    font-size: 36px;
    text-transform: uppercase;
  }

  @at-root #{&}__subtitle {
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 10px;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: transparent;
  color: #fff;
  text-align: center;
  a {
    color: #ffffff;
    padding-left: 5px;
  }
}
</style>
