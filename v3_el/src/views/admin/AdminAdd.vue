<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="adminForm" :label-width="formLabelWidth" ref="adminFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="adminForm.username" placeholder="请输入用户名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="密码" prop="password">
              <el-input v-model="adminForm.password" placeholder="请输入密码" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="adminForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
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
import {defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs} from 'vue';
import adminApi from '@/api/adminApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {AdminForm} from "@/types/req/adminForm";
import type {Result} from '@/types/result'
import type {Admin} from "@/types/resp/admin";
import type {Id} from "@/types/id";

const props = defineProps<Id>()
const adminFormRef = ref<FormInstance | null>(null);
let adminForm = reactive<AdminForm>({
  username: '',
  password: '',
  name: '',
})
const emit = defineEmits<{
  (e: 'resetAdminAddEvent'): void;
  (e: 'closeAdminAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initAdminFormById(props.id)
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

const initAdminFormById = async (id: number) => {
  const resp: Result<Admin> = await adminApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(adminForm, resp.data)
  }
}

const onReset = () => {
  if (adminFormRef.value) {
    adminFormRef.value.resetFields()
  }
  emit('resetAdminAddEvent')
}

const onSave = () => {
  if (!adminFormRef.value) {
    return
  }
  adminFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await adminApi.save(adminForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeAdminAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}


const onBack = () => {
  emit('closeAdminAddEvent')
}
</script>

<style lang="scss">
</style>
