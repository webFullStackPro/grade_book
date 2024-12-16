<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="studentForm" :label-width="formLabelWidth" ref="studentFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="学号" prop="studentNumber">
              <el-input v-model="studentForm.studentNumber" placeholder="请输入学号" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="studentForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="密码" prop="password">
              <el-input v-model="studentForm.password" placeholder="请输入密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="studentForm.gender" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="出生日期" prop="birthDate">
              <el-date-picker
                  v-model="studentForm.birthDate" type="date" placeholder="出生日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="专业名称" prop="majorName">
              <el-input v-model="studentForm.majorName" placeholder="请选择专业名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findMajor"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="年级" prop="grade">
              <el-input-number v-model="studentForm.grade" :min="2000" :max="2100"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="studentForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="studentForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="省/市/区">
              <el-cascader
                v-model="provinceCityArea"
                :options="provinceCityAreaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
                @change="handleChange"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="家庭地址" prop="address">
              <el-input v-model="studentForm.address" placeholder="请输入家庭地址" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="入学日期" prop="enrollmentDate">
              <el-date-picker
                  v-model="studentForm.enrollmentDate" type="date" placeholder="入学日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="毕业日期" prop="graduationDate">
              <el-date-picker
                  v-model="studentForm.graduationDate" type="date" placeholder="毕业日期" value-format="yyyy-MM-dd">
              </el-date-picker>
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
    <el-dialog v-model="majorSelectorVisible" v-if="majorSelectorVisible" title="专业信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <major-selector @major-selected-event="handleMajorSelectedEvent">
      </major-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import studentApi from '@/api/studentApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {StudentForm} from "@/types/req/studentForm";
import type {Result} from '@/types/result'
import type {Student} from "@/types/resp/student";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import MajorSelector from "@/views/major/MajorSelector.vue";
import areas from "@/locales/area.json";

const props = defineProps<Id>()
const studentFormRef = ref<FormInstance | null>(null);
let studentForm = reactive<StudentForm>({
  studentNumber: '',
  name: '',
  password: '',
  gender: undefined,
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
})
const provinceCityArea = ref<string[]>([])
const provinceCityAreaOptions = areas.provinces
const majorSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetStudentAddEvent'): void;
  (e: 'closeStudentAddEvent', data?: { search: boolean }): void;
}>()

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
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initStudentFormById(props.id)
  }
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

const initStudentFormById = async (id: number) => {
  const resp: Result<Student> = await studentApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(studentForm, resp.data)
    provinceCityArea.value = []
    if (studentForm.province) {
      provinceCityArea.value.push(studentForm.province)
    }
    if (studentForm.city) {
      provinceCityArea.value.push(studentForm.city)
    }
    if (studentForm.area) {
      provinceCityArea.value.push(studentForm.area)
    }
  }
}

const onReset = () => {
  if (studentFormRef.value) {
    studentFormRef.value.resetFields()
  }
  provinceCityArea.value = []
  emit('resetStudentAddEvent')
}

const onSave = () => {
  if (!studentFormRef.value) {
    return
  }
  studentFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await studentApi.save(studentForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeStudentAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findMajor = () => {
  majorSelectorVisible.value = true
}

const handleMajorSelectedEvent = (selectedMajor: any) => {
  majorSelectorVisible.value = false
  if (selectedMajor && 'majorId' in selectedMajor && studentForm.majorId !== selectedMajor['majorId']) {
    studentForm.majorId = selectedMajor['majorId']
    studentForm.majorName = selectedMajor['majorName']
  }
}

const handleChange = (value: string[]) => {
  if (value && value.length > 0) {
    studentForm.province = value[0]
  }
  if (value && value.length > 1) {
    studentForm.city = value[1]
  }
  if (value && value.length > 2) {
    studentForm.area = value[2]
  }
}

const onBack = () => {
  emit('closeStudentAddEvent')
}
</script>

<style lang="scss">
</style>
