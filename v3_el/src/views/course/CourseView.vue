<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="courseForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系名称">
            <el-input v-model="courseForm.facultyName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="courseForm.teacherName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="课程代码">
            <el-input v-model="courseForm.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="课程名称">
            <el-input v-model="courseForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="学分">
            <el-input v-model="courseForm.credit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="课程描述" prop="courseDescription">
            <el-input v-model="courseForm.courseDescription" placeholder="请输入课程描述" type="textarea" :rows="5" maxlength="65535"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="courseForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="courseForm.modifyTime"></el-input>
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
import courseApi from '@/api/courseApi'
import type {Course} from "@/types/resp/course";
import type {Id} from "@/types/id"

const courseForm = reactive<Partial<Course>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeCourseViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initCourseById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initCourseById = async (id: number) => {
  const resp = await courseApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(courseForm, resp.data)
  }
}
const onBack = () => {
  emit('closeCourseViewEvent')
}
</script>

<style lang="scss">
</style>
