<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="universityForm" :label-width="formLabelWidth" ref="universityFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="学校名称" prop="name">
              <el-input v-model="universityForm.name" placeholder="请输入学校名称" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="成立日期" prop="establishmentDate">
              <el-date-picker
                  v-model="universityForm.establishmentDate" type="date" placeholder="成立日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="universityForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="universityForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="省/市/区">
              <el-cascader
                v-model="provinceCityArea"
                :options="provinceCityAreaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
                @change="handleChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="地址" prop="location">
              <el-input v-model="universityForm.location" placeholder="请输入地址" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="学校简介" prop="universityDescription">
              <el-input v-model="universityForm.universityDescription" placeholder="请输入学校简介" type="textarea" :rows="5" maxlength="65535"></el-input>
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
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import universityApi from '@/api/universityApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {UniversityForm} from "@/types/req/universityForm";
import type {Result} from '@/types/result'
import type {University} from "@/types/resp/university";
import type {Id} from "@/types/id";
import areas from '@/locales/area.json';

const props = defineProps<Id>()
const universityFormRef = ref<FormInstance | null>(null);
let universityForm = reactive<UniversityForm>({
  name: '',
  establishmentDate: '',
  contactPhone: '',
  email: '',
  province: '',
  city: '',
  area: '',
  location: '',
  universityDescription: '',
})
const provinceCityArea = ref<string[]>([])
const provinceCityAreaOptions = areas.provinces
const emit = defineEmits<{
  (e: 'resetUniversityAddEvent'): void;
  (e: 'closeUniversityAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  name: [
    { required: true, message: '请输入学校名称', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initUniversityFormById(props.id)
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

const initUniversityFormById = async (id: number) => {
  const resp: Result<University> = await universityApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(universityForm, resp.data)
    provinceCityArea.value = []
    if (universityForm.province) {
      provinceCityArea.value.push(universityForm.province)
    }
    if (universityForm.city) {
      provinceCityArea.value.push(universityForm.city)
    }
    if (universityForm.area) {
      provinceCityArea.value.push(universityForm.area)
    }
  }
}

const onReset = () => {
  if (universityFormRef.value) {
    universityFormRef.value.resetFields()
  }
  provinceCityArea.value = []
  emit('resetUniversityAddEvent')
}

const onSave = () => {
  if (!universityFormRef.value) {
    return
  }
  universityFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await universityApi.save(universityForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeUniversityAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const handleChange = (value: string[]) => {
  if (value && value.length > 0) {
    universityForm.province = value[0]
  }
  if (value && value.length > 1) {
    universityForm.city = value[1]
  }
  if (value && value.length > 2) {
    universityForm.area = value[2]
  }
}

const onBack = () => {
  emit('closeUniversityAddEvent')
}
</script>

<style lang="scss">
</style>
