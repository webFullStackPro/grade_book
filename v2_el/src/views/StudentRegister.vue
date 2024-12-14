<template>
  <div class="register-page">
    <div class="register">
      <div class="login__logo"></div>
      <div class="login__title">{{ $t('title') }}</div>
      <div class="login__subtitle">{{ $t('studentRegisterTitle') }}</div>
      <el-form :model="registerForm" :rules="rules" ref="registerForm" @keyup.enter.native="onRegister" size="medium" :label-width="labelWidth">
        <el-row>
          <el-col :span="8">
            <el-form-item label="学号" prop="studentNumber">
              <el-input v-model="registerForm.studentNumber" placeholder="请输入学号" maxlength="20"></el-input>
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
              <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password2" label="确认密码">
              <el-input v-model="registerForm.password2" type="password" placeholder="请确认确认密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="birthDate">
              <el-date-picker
                  v-model="registerForm.birthDate" type="date" placeholder="出生日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="专业名称" prop="majorName">
              <el-input v-model="registerForm.majorName" placeholder="请选择专业名称" readonly="readonly">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="findMajor"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年级" prop="grade">
              <el-input-number v-model="registerForm.grade" :min="2000" :max="2100"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入学日期" prop="enrollmentDate">
              <el-date-picker
                  v-model="registerForm.enrollmentDate" type="date" placeholder="入学日期" value-format="yyyy-MM-dd">
              </el-date-picker>
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
          <el-col :span="8">
            <el-form-item label="毕业日期" prop="graduationDate">
              <el-date-picker
                  v-model="registerForm.graduationDate" type="date" placeholder="毕业日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="省" prop="province">
              <el-input v-model="registerForm.province" placeholder="请输入省" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市" prop="city">
              <el-input v-model="registerForm.city" placeholder="请输入市" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区" prop="area">
              <el-input v-model="registerForm.area" placeholder="请输入区" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="家庭地址" prop="address">
              <el-input v-model="registerForm.address" placeholder="请输入家庭地址" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
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
    <el-dialog :visible.sync="majorSelectorVisible" v-if="majorSelectorVisible" title="专业信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <major-selector @major-selected-event="handleMajorSelectedEvent">
      </major-selector>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from '@/api/studentApi'
import captchaMixin from "@/mixins/captchaMixin";
import MajorSelector from "@/views/major/MajorSelector.vue";
export default {
  name: 'StudentRegister',
  components: {MajorSelector},
  mixins: [
    captchaMixin
  ],
  data () {
    return {
      registerForm: {
        studentNumber: '',
        name: '',
        password: '',
        password2: '',
        gender: 1,
        birthDate: '',
        majorId: '',
        majorName: '',
        grade: '',
        contactPhone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        enrollmentDate: '',
        graduationDate: '',
        verificationCode: ''
      },
      labelWidth: '80px',
      rules: {
        studentNumber: [
          { required: true, message: '学号不能为空', trigger: 'blur' }
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
        birthDate: [
          { required: true, message: '出生日期不能为空', trigger: 'blur' }
        ],
        enrollmentDate: [
          { required: true, message: '入学日期不能为空', trigger: 'blur' }
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
      majorSelectorVisible: false
    }
  },
  created () {
  },
  methods: {
    onReset () {
      this.registerForm = {
        studentNumber: '',
        name: '',
        password: '',
        password2: '',
        gender: 1,
        birthDate: '',
        majorId: '',
        majorName: '',
        grade: '',
        contactPhone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        enrollmentDate: '',
        graduationDate: '',
        verificationCode: ''
      }
      this.provinceCityArea = []
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
          studentApi.save(this.registerForm)
              .then(data => {
                console.log('data', data)
                if (data.code === 1) {
                  this.$message.success('注册成功')
                  this.$router.push({ path: '/Login', query: {type: 3} })
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
    findMajor () {
      this.majorSelectorVisible = true
    },
    handleMajorSelectedEvent (selectedMajor) {
      this.majorSelectorVisible = false
      if (selectedMajor && 'majorId' in selectedMajor && this.registerForm.majorId !== selectedMajor['majorId']) {
        this.registerForm.majorId = selectedMajor['majorId']
        this.registerForm.majorName = selectedMajor['majorName']
      }
    },
    onBack () {
      this.$router.push({ name: 'Login', query: {type: 3}})
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/register";
</style>
