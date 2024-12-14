<template>
  <div class="register-page">
    <div class="register">
      <div class="login__logo"></div>
      <div class="login__title">{{ $t('title') }}</div>
      <div class="login__subtitle">{{ $t('teacherRegisterTitle') }}</div>
      <el-form :model="teacherRegisterForm" :rules="rules" ref="teacherRegisterFormRef" @keyup.enter.native="onRegister" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="院系名称" prop="facultyName">
              <el-input v-model="teacherRegisterForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findFaculty"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="teacherRegisterForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="teacherRegisterForm.gender" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="密码" prop="password">
              <el-input v-model="teacherRegisterForm.password" placeholder="请输入密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认密码" prop="password2">
              <el-input v-model="teacherRegisterForm.password2" placeholder="请输入确认密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职称" prop="title">
              <el-select v-model="teacherRegisterForm.title" placeholder="请选择职称">
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
              <el-input v-model="teacherRegisterForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="teacherRegisterForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="教师简介" prop="profile">
              <el-input v-model="teacherRegisterForm.profile" placeholder="请输入专业简介" type="textarea" :rows="5" maxlength="65535"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="verificationCode" label="验证码">
              <el-input v-model="teacherRegisterForm.verificationCode" placeholder="请输入验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <canvas id="captchaCanvas" width="150" height="50" @click="drawCaptcha"></canvas>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="center-container">
              <el-button type="primary" @click="onRegister" :loading="loading">注册</el-button>
              <el-button @click="onReset">重置</el-button>
              <el-button type="primary" @click="onBack">返回登录</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog v-model="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, reactive, ref, toRefs} from 'vue';
import {useCaptcha} from '@/composables/useCaptcha'
import teacherApi from '@/api/teacherApi'
import {ElMessage, type FormInstance} from "element-plus";
import type {TeacherRegisterForm} from "@/types/req/teacherRegisterForm";
import type {Result} from "@/types/result";
import {useRouter} from "vue-router";
import {Search} from "@element-plus/icons-vue";
import FacultySelector from "@/views/faculty/FacultySelector.vue";

const { generatedVerificationCode, drawCaptcha } = useCaptcha()

const teacherRegisterFormRef = ref<FormInstance | null>(null);
let teacherRegisterForm = reactive<TeacherRegisterForm>({
  facultyId: 0,
  facultyName: '',
  name: '',
  password: '',
  password2: '',
  title: undefined,
  gender: undefined,
  contactPhone: '',
  email: '',
  profile: '',
  verificationCode: ''
})
const facultySelectorVisible = ref<boolean>(false)
const loading = ref<boolean>(false)

const rules = reactive({
  facultyName: [
    { required: true, message: '请输入院系名称', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '请确认密码', trigger: 'blur' }
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
  verificationCode: [
    { required: true, message: '验证码不能为空', trigger: 'blur' }
  ]
});

const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')
const router = useRouter()

onMounted(() => {
  const globalState = inject('globalState', {} as { dialogWidth?: string, dialogTop?: string, formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
  if (globalStateRefs.dialogWidth) {
    dialogWidth.value = globalStateRefs.dialogWidth.value || ''
  }
  if (globalStateRefs.dialogTop) {
    dialogTop.value = globalStateRefs.dialogTop.value || ''
  }
});

const onReset = () => {
  if (teacherRegisterFormRef.value) {
    teacherRegisterFormRef.value.resetFields()
  }
}

const refreshCaptcha = () => {
  teacherRegisterForm.verificationCode = ''
  drawCaptcha()
}

const onRegister = () => {
  if (!teacherRegisterFormRef.value) {
    return
  }
  teacherRegisterFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (teacherRegisterForm.password !== teacherRegisterForm.password2) {
        ElMessage.error('两次输入的密码不一致，请重新输入')
        teacherRegisterForm.password = ''
        teacherRegisterForm.password2 = ''
        refreshCaptcha()
        return
      }
      if (generatedVerificationCode.value.toLowerCase() !== teacherRegisterForm.verificationCode.toLowerCase()) {
        ElMessage.error('验证码错误')
        refreshCaptcha()
        return
      }
      loading.value = true
      const resp: Result<void> = await teacherApi.save(teacherRegisterForm)
      if (resp && resp.code === 1) {
        ElMessage.success('注册成功')
        await router.push({ path: '/Login', query: {type: 3} })
      } else {
        ElMessage.error('注册失败:' + (resp.msg ? resp.msg : ''))
        refreshCaptcha()
        loading.value = false
      }
    }
  })
}

const findFaculty = () => {
  facultySelectorVisible.value = true
}

const handleFacultySelectedEvent = (selectedFaculty: any) => {
  facultySelectorVisible.value = false
  if (selectedFaculty && 'facultyId' in selectedFaculty && teacherRegisterForm.facultyId !== selectedFaculty['facultyId']) {
    teacherRegisterForm.facultyId = selectedFaculty['facultyId']
    teacherRegisterForm.facultyName = selectedFaculty['facultyName']
  }
}

const onBack = () => {
  router.push({ path: '/Login', query: {type: 2} })
}

</script>

<style lang="scss">
@import "@/assets/register.css";
</style>
