<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="attendanceForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程名称">
            <el-input v-model="attendanceForm.courseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学号">
            <el-input v-model="attendanceForm.studentNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="考勤日期">
            <el-input v-model="attendanceForm.attendanceDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态">
            <el-select v-model="attendanceForm.status" placeholder="请选择状态">
              <el-option label="出勤" :value="10"></el-option>
              <el-option label="缺勤" :value="20"></el-option>
              <el-option label="迟到" :value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="attendanceForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="attendanceForm.modifyTime"></el-input>
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
import attendanceApi from '@/api/attendanceApi'
import type {Attendance} from "@/types/resp/attendance";
import type {Id} from "@/types/id"

const attendanceForm = reactive<Partial<Attendance>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeAttendanceViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initAttendanceById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initAttendanceById = async (id: number) => {
  const resp = await attendanceApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(attendanceForm, resp.data)
  }
}
const onBack = () => {
  emit('closeAttendanceViewEvent')
}
</script>

<style lang="scss">
</style>