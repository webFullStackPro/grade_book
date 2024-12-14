<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="gradeForm" :label-width="formLabelWidth" ref="gradeFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="gradeForm.courseName" placeholder="请选择课程名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findCourse"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学生学号" prop="studentNumber">
              <el-input v-model="gradeForm.studentNumber" placeholder="请选择学生学号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStudent"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="成绩" prop="grade">
              <el-input-number v-model="gradeForm.grade" :precision="2" :step="0.1" :min="1" :max="999"></el-input-number>
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
    <el-dialog v-model="courseSelectorVisible" v-if="courseSelectorVisible" title="课程信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <course-selector @course-selected-event="handleCourseSelectedEvent">
      </course-selector>
    </el-dialog>
    <el-dialog v-model="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import gradeApi from '@/api/gradeApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {GradeForm} from "@/types/req/gradeForm";
import type {Result} from '@/types/result'
import type {Grade} from "@/types/resp/grade";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";

const props = defineProps<Id>()
const gradeFormRef = ref<FormInstance | null>(null);
let gradeForm = reactive<GradeForm>({
  courseId: 0,
  courseName: '',
  studentId: 0,
  studentNumber: '',
  grade: 0,
})
const courseSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetGradeAddEvent'): void;
  (e: 'closeGradeAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  studentNumber: [
    { required: true, message: '请输入学生学号', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initGradeFormById(props.id)
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

const initGradeFormById = async (id: number) => {
  const resp: Result<Grade> = await gradeApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(gradeForm, resp.data)
  }
}

const onReset = () => {
  if (gradeFormRef.value) {
    gradeFormRef.value.resetFields()
  }
  emit('resetGradeAddEvent')
}

const onSave = () => {
  if (!gradeFormRef.value) {
    return
  }
  gradeFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await gradeApi.save(gradeForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeGradeAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findCourse = () => {
  courseSelectorVisible.value = true
}

const handleCourseSelectedEvent = (selectedCourse: any) => {
  courseSelectorVisible.value = false
  if (selectedCourse && 'courseId' in selectedCourse && gradeForm.courseId !== selectedCourse['courseId']) {
    gradeForm.courseId = selectedCourse['courseId']
    gradeForm.courseName = selectedCourse['courseName']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && gradeForm.studentId !== selectedStudent['studentId']) {
    gradeForm.studentId = selectedStudent['studentId']
    gradeForm.studentNumber = selectedStudent['studentNumber']
  }
}

const onBack = () => {
  emit('closeGradeAddEvent')
}
</script>

<style lang="scss">
</style>
