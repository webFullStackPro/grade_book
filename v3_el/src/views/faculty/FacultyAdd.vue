<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="facultyForm" :label-width="formLabelWidth" ref="facultyFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="学校名称" prop="universityName">
              <el-input v-model="facultyForm.universityName" placeholder="请选择学校名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findUniversity"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="院系名称" prop="name">
              <el-input v-model="facultyForm.name" placeholder="请输入院系名称" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="成立日期" prop="establishmentDate">
              <el-date-picker
                  v-model="facultyForm.establishmentDate" type="date" placeholder="成立日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="facultyForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="facultyForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="办公地点" prop="officeLocation">
              <el-input v-model="facultyForm.officeLocation" placeholder="请输入办公地点" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="院系网址" prop="website">
              <el-input v-model="facultyForm.website" placeholder="请输入院系网址" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="院系简介" prop="facultyDescription">
              <el-input v-model="facultyForm.facultyDescription" placeholder="请输入院系简介" type="textarea" :rows="5" maxlength="65535"></el-input>
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
    <el-dialog v-model="universitySelectorVisible" v-if="universitySelectorVisible" title="学校信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <university-selector @university-selected-event="handleUniversitySelectedEvent">
      </university-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import facultyApi from '@/api/facultyApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {FacultyForm} from "@/types/req/facultyForm";
import type {Result} from '@/types/result'
import type {Faculty} from "@/types/resp/faculty";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import UniversitySelector from "@/views/university/UniversitySelector.vue";

const props = defineProps<Id>()
const facultyFormRef = ref<FormInstance | null>(null);
let facultyForm = reactive<FacultyForm>({
  universityId: 0,
  universityName: '',
  name: '',
  establishmentDate: '',
  contactPhone: '',
  email: '',
  officeLocation: '',
  website: '',
  facultyDescription: '',
})
const universitySelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetFacultyAddEvent'): void;
  (e: 'closeFacultyAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  universityName: [
    { required: true, message: '请输入学校名称', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入院系名称', trigger: 'blur' }
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
    initFacultyFormById(props.id)
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

const initFacultyFormById = async (id: number) => {
  const resp: Result<Faculty> = await facultyApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(facultyForm, resp.data)
  }
}

const onReset = () => {
  if (facultyFormRef.value) {
    facultyFormRef.value.resetFields()
  }
  emit('resetFacultyAddEvent')
}

const onSave = () => {
  if (!facultyFormRef.value) {
    return
  }
  facultyFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await facultyApi.save(facultyForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeFacultyAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findUniversity = () => {
  universitySelectorVisible.value = true
}

const handleUniversitySelectedEvent = (selectedUniversity: any) => {
  universitySelectorVisible.value = false
  if (selectedUniversity && 'universityId' in selectedUniversity && facultyForm.universityId !== selectedUniversity['universityId']) {
    facultyForm.universityId = selectedUniversity['universityId']
    facultyForm.universityName = selectedUniversity['universityName']
  }
}

const onBack = () => {
  emit('closeFacultyAddEvent')
}
</script>

<style lang="scss">
</style>
