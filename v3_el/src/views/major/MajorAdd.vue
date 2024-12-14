<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="majorForm" :label-width="formLabelWidth" ref="majorFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="院系名称" prop="facultyName">
              <el-input v-model="majorForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findFaculty"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="专业名称" prop="name">
              <el-input v-model="majorForm.name" placeholder="请输入专业名称" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="学位类型" prop="degreeType">
              <el-select v-model="majorForm.degreeType" placeholder="请选择学位类型">
                <el-option label="学士" :value="1"></el-option>
                <el-option label="硕士" :value="2"></el-option>
                <el-option label="博士" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学制(年)" prop="duration">
              <el-input-number v-model="majorForm.duration" :min="1" :max="10"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="majorForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="majorForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="办公地点" prop="officeLocation">
              <el-input v-model="majorForm.officeLocation" placeholder="请输入办公地点" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="专业简介" prop="majorDescription">
              <el-input v-model="majorForm.majorDescription" placeholder="请输入专业简介" type="textarea" :rows="5" maxlength="65535"></el-input>
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
import majorApi from '@/api/majorApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {MajorForm} from "@/types/req/majorForm";
import type {Result} from '@/types/result'
import type {Major} from "@/types/resp/major";
import type {Id} from "@/types/id";
import {Search} from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";

const props = defineProps<Id>()
const majorFormRef = ref<FormInstance | null>(null);
let majorForm = reactive<MajorForm>({
  facultyId: 0,
  facultyName: '',
  name: '',
  degreeType: undefined,
  duration: 0,
  contactPhone: '',
  email: '',
  officeLocation: '',
  majorDescription: '',
})
const facultySelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetMajorAddEvent'): void;
  (e: 'closeMajorAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  facultyName: [
    { required: true, message: '请输入院系名称', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入专业名称', trigger: 'blur' }
  ],
  degreeType: [
    { required: true, message: '请输入学位类型', trigger: 'blur' }
  ],
  duration: [
    { required: true, message: '请输入学制(年)', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  officeLocation: [
    { required: true, message: '请输入办公地点', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initMajorFormById(props.id)
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

const initMajorFormById = async (id: number) => {
  const resp: Result<Major> = await majorApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(majorForm, resp.data)
  }
}

const onReset = () => {
  if (majorFormRef.value) {
    majorFormRef.value.resetFields()
  }
  emit('resetMajorAddEvent')
}

const onSave = () => {
  if (!majorFormRef.value) {
    return
  }
  majorFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await majorApi.save(majorForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeMajorAddEvent', {search: true})
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
  if (selectedFaculty && 'facultyId' in selectedFaculty && majorForm.facultyId !== selectedFaculty['facultyId']) {
    majorForm.facultyId = selectedFaculty['facultyId']
    majorForm.facultyName = selectedFaculty['facultyName']
  }
}

const onBack = () => {
  emit('closeMajorAddEvent')
}
</script>

<style lang="scss">
</style>
