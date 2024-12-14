<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="adminForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="用户名">
            <el-input v-model="adminForm.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="密码">
            <el-input v-model="adminForm.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="adminForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="adminForm.createTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="adminForm.modifyTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="12" :offset="6">
          <div class="form-button-container">
            <el-button @click="onBack" type="primary">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import adminApi from '@/api/adminApi'
import type {Admin} from "@/types/resp/admin";
import type {Id} from "@/types/id"

const adminForm = reactive<Partial<Admin>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeAdminViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initAdminById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initAdminById = async (id: number) => {
  const resp = await adminApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(adminForm, resp.data)
  }
}
const onBack = () => {
  emit('closeAdminViewEvent')
}
</script>

<style lang="scss">
</style>