<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="gradeForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程名称">
            <el-input v-model="gradeForm.courseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学号">
            <el-input v-model="gradeForm.studentNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="成绩">
            <el-input v-model="gradeForm.grade"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="gradeForm.createTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="gradeForm.modifyTime"></el-input>
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
import gradeApi from '@/api/gradeApi'
import type {Grade} from "@/types/resp/grade";
import type {Id} from "@/types/id"

const gradeForm = reactive<Partial<Grade>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeGradeViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initGradeById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initGradeById = async (id: number) => {
  const resp = await gradeApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(gradeForm, resp.data)
  }
}
const onBack = () => {
  emit('closeGradeViewEvent')
}
</script>

<style lang="scss">
</style>