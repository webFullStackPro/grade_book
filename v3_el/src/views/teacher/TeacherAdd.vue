<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="teacherForm" :label-width="formLabelWidth" ref="teacherFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="院系名称" prop="facultyName">
              <el-input v-model="teacherForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findFaculty"><Search/></el-icon>
                </template>
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
              <el-input v-model="teacherForm.profile" placeholder="请输入专业简介" type="textarea" :rows="5" maxlength="65535"></el-input>
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
    <el-dialog v-model="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs} from 'vue';
import teacherApi from '@/api/teacherApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {TeacherForm} from "@/types/req/teacherForm";
import type {Result} from '@/types/result'
import type {Teacher} from "@/types/resp/teacher";
import type {Id} from "@/types/id";
import {Search} from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";

const props = defineProps<Id>()
const teacherFormRef = ref<FormInstance | null>(null);
let teacherForm = reactive<TeacherForm>({
  facultyId: 0,
  facultyName: '',
  name: '',
  password: '',
  title: undefined,
  gender: undefined,
  contactPhone: '',
  email: '',
  profile: '',
})
const facultySelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetTeacherAddEvent'): void;
  (e: 'closeTeacherAddEvent', data?: { search: boolean }): void;
}>()

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
  ]
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initTeacherFormById(props.id)
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

const initTeacherFormById = async (id: number) => {
  const resp: Result<Teacher> = await teacherApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(teacherForm, resp.data)
  }
}

const onReset = () => {
  if (teacherFormRef.value) {
    teacherFormRef.value.resetFields()
  }
  emit('resetTeacherAddEvent')
}

const onSave = () => {
  if (!teacherFormRef.value) {
    return
  }
  teacherFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await teacherApi.save(teacherForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeTeacherAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findFaculty = () => {
  facultySelectorVisible.value = true
}

const handleFacultySelectedEvent = (selectedFaculty: any) => {
  facultySelectorVisible.value = false
  if (selectedFaculty && 'facultyId' in selectedFaculty && teacherForm.facultyId !== selectedFaculty['facultyId']) {
    teacherForm.facultyId = selectedFaculty['facultyId']
    teacherForm.facultyName = selectedFaculty['facultyName']
  }
}

const onBack = () => {
  emit('closeTeacherAddEvent')
}
</script>

<style lang="scss">
</style>
