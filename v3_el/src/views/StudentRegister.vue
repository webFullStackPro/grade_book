<template>
  <div class="register-page">
    <div class="register">
      <div class="login-title">{{ $t('title') }}</div>
      <div class="login-subtitle">{{ $t('studentRegisterTitle') }}</div>
      <el-form :model="studentRegisterForm" :rules="rules" ref="studentRegisterFormRef" @keyup.enter.native="onRegister" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="学号" prop="studentNumber">
              <el-input v-model="studentRegisterForm.studentNumber" placeholder="请输入学号" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="studentRegisterForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="studentRegisterForm.gender" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="密码" prop="password">
              <el-input v-model="studentRegisterForm.password" type="password" placeholder="请输入密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password2" label="确认密码">
              <el-input v-model="studentRegisterForm.password2" type="password" placeholder="请确认确认密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="birthDate">
              <el-date-picker
                  v-model="studentRegisterForm.birthDate" type="date" placeholder="出生日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="专业名称" prop="majorName">
              <el-input v-model="studentRegisterForm.majorName" placeholder="请选择专业名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findMajor"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年级" prop="grade">
              <el-input-number v-model="studentRegisterForm.grade" :min="2000" :max="2100"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入学日期" prop="enrollmentDate">
              <el-date-picker
                  v-model="studentRegisterForm.enrollmentDate" type="date" placeholder="入学日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="studentRegisterForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="studentRegisterForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业日期" prop="graduationDate">
              <el-date-picker
                  v-model="studentRegisterForm.graduationDate" type="date" placeholder="毕业日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="省/市/区">
              <el-cascader
                v-model="provinceCityArea"
                :options="provinceCityAreaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
                @change="handleChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="verificationCode" label="验证码">
              <el-input v-model="studentRegisterForm.verificationCode" placeholder="请输入验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <canvas id="captchaCanvas" width="150" height="50" @click="drawCaptcha"></canvas>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="家庭地址" prop="address">
              <el-input v-model="studentRegisterForm.address" placeholder="请输入家庭地址" maxlength="255"></el-input>
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
    <el-dialog v-model="majorSelectorVisible" v-if="majorSelectorVisible" title="专业信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <major-selector @major-selected-event="handleMajorSelectedEvent">
      </major-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, reactive, ref, toRefs} from 'vue';
import {useCaptcha} from '@/composables/useCaptcha'
import studentApi from '@/api/studentApi'
import MajorSelector from "@/views/major/MajorSelector.vue";
import {ElMessage, type FormInstance} from "element-plus";
import type {StudentRegisterForm} from "@/types/req/studentRegisterForm";
import areas from "@/locales/area.json";
import type {Result} from "@/types/result";
import {useRouter} from "vue-router";
import {Search} from "@element-plus/icons-vue";

const { generatedVerificationCode, drawCaptcha } = useCaptcha()

const studentRegisterFormRef = ref<FormInstance | null>(null);
let studentRegisterForm = reactive<StudentRegisterForm>({
  studentNumber: '',
  name: '',
  password: '',
  password2: '',
  gender: 1,
  birthDate: '',
  majorId: 0,
  majorName: '',
  grade: 0,
  contactPhone: '',
  email: '',
  province: '',
  city: '',
  area: '',
  address: '',
  enrollmentDate: '',
  graduationDate: '',
  verificationCode: ''
})
const provinceCityArea = ref<string[]>([])
const provinceCityAreaOptions = areas.provinces
const majorSelectorVisible = ref<boolean>(false)
const loading = ref<boolean>(false)

const rules = reactive({
  studentNumber: [
    { required: true, message: '请输入学号', trigger: 'blur' }
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
  gender: [
    { required: true, message: '请输入性别', trigger: 'blur' }
  ],
  birthDate: [
    { required: true, message: '请输入出生日期', trigger: 'blur' }
  ],
  majorName: [
    { required: true, message: '请输入专业名称', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' }
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
  if (studentRegisterFormRef.value) {
    studentRegisterFormRef.value.resetFields()
  }
  provinceCityArea.value = []
}

const refreshCaptcha = () => {
  studentRegisterForm.verificationCode = ''
  drawCaptcha()
}

const onRegister = () => {
  if (!studentRegisterFormRef.value) {
    return
  }
  studentRegisterFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (studentRegisterForm.password !== studentRegisterForm.password2) {
        ElMessage.error('两次输入的密码不一致，请重新输入')
        studentRegisterForm.password = ''
        studentRegisterForm.password2 = ''
        refreshCaptcha()
        return
      }
      if (generatedVerificationCode.value.toLowerCase() !== studentRegisterForm.verificationCode.toLowerCase()) {
        ElMessage.error('验证码错误')
        refreshCaptcha()
        return
      }
      loading.value = true
      const resp: Result<void> = await studentApi.save(studentRegisterForm)
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

const findMajor = () => {
  majorSelectorVisible.value = true
}

const handleMajorSelectedEvent = (selectedMajor: any) => {
  majorSelectorVisible.value = false
  if (selectedMajor && 'majorId' in selectedMajor && studentRegisterForm.majorId !== selectedMajor['majorId']) {
    studentRegisterForm.majorId = selectedMajor['majorId']
    studentRegisterForm.majorName = selectedMajor['majorName']
  }
}

const handleChange = (value: string[]) => {
  if (value && value.length > 0) {
    studentRegisterForm.province = value[0]
  }
  if (value && value.length > 1) {
    studentRegisterForm.city = value[1]
  }
  if (value && value.length > 2) {
    studentRegisterForm.area = value[2]
  }
}

const onBack = () => {
  router.push({ path: '/Login', query: {type: 3} })
}

</script>

<style lang="scss">
@import "@/assets/register.css";
</style>
