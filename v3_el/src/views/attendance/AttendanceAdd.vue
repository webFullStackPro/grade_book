<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="attendanceForm" :label-width="formLabelWidth" ref="attendanceFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="attendanceForm.courseName" placeholder="请选择课程名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findCourse"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学生学号" prop="studentNumber">
              <el-input v-model="attendanceForm.studentNumber" placeholder="请选择学生学号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStudent"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="考勤日期" prop="attendanceDate">
              <el-date-picker
                  v-model="attendanceForm.attendanceDate" type="date" placeholder="考勤日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="status">
              <el-select v-model="attendanceForm.status" placeholder="请选择状态">
                <el-option label="出勤" :value="10"></el-option>
                <el-option label="缺勤" :value="20"></el-option>
                <el-option label="迟到" :value="30"></el-option>
              </el-select>
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
import {defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs} from 'vue';
import attendanceApi from '@/api/attendanceApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {AttendanceForm} from "@/types/req/attendanceForm";
import type {Result} from '@/types/result'
import type {Attendance} from "@/types/resp/attendance";
import type {Id} from "@/types/id";
import {Search} from '@element-plus/icons-vue';
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";

const props = defineProps<Id>()
const attendanceFormRef = ref<FormInstance | null>(null);
let attendanceForm = reactive<AttendanceForm>({
  courseId: 0,
  courseName: '',
  studentId: 0,
  studentNumber: '',
  attendanceDate: '',
  status: undefined,
})
const courseSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetAttendanceAddEvent'): void;
  (e: 'closeAttendanceAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  studentNumber: [
    { required: true, message: '请输入学生学号', trigger: 'blur' }
  ],
  attendanceDate: [
    { required: true, message: '请输入考勤日期', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请输入状态', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initAttendanceFormById(props.id)
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

const initAttendanceFormById = async (id: number) => {
  const resp: Result<Attendance> = await attendanceApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(attendanceForm, resp.data)
  }
}

const onReset = () => {
  if (attendanceFormRef.value) {
    attendanceFormRef.value.resetFields()
  }
  emit('resetAttendanceAddEvent')
}

const onSave = () => {
  if (!attendanceFormRef.value) {
    return
  }
  attendanceFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await attendanceApi.save(attendanceForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeAttendanceAddEvent', {search: true})
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
  if (selectedCourse && 'courseId' in selectedCourse && attendanceForm.courseId !== selectedCourse['courseId']) {
    attendanceForm.courseId = selectedCourse['courseId']
    attendanceForm.courseName = selectedCourse['courseName']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && attendanceForm.studentId !== selectedStudent['studentId']) {
    attendanceForm.studentId = selectedStudent['studentId']
    attendanceForm.studentNumber = selectedStudent['studentNumber']
  }
}

const onBack = () => {
  emit('closeAttendanceAddEvent')
}
</script>

<style lang="scss">
</style>
