<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="courseForm" :label-width="formLabelWidth" ref="courseFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="院系名称" prop="facultyName">
              <el-input v-model="courseForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findFaculty"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="教师姓名" prop="teacherName">
              <el-input v-model="courseForm.teacherName" placeholder="请选择教师姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findTeacher"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="课程代码" prop="code">
              <el-input v-model="courseForm.code" placeholder="请输入课程代码" maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="课程名称" prop="name">
              <el-input v-model="courseForm.name" placeholder="请输入课程名称" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="学分" prop="credit">
              <el-input-number v-model="courseForm.credit" :min="1" :max="10"></el-input-number>
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
    <el-dialog v-model="teacherSelectorVisible" v-if="teacherSelectorVisible" title="教师信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <teacher-selector @teacher-selected-event="handleTeacherSelectedEvent">
      </teacher-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs} from 'vue';
import courseApi from '@/api/courseApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {CourseForm} from "@/types/req/courseForm";
import type {Result} from '@/types/result'
import type {Course} from "@/types/resp/course";
import type {Id} from "@/types/id";
import {Search} from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherSelector from "@/views/teacher/TeacherSelector.vue";

const props = defineProps<Id>()
const courseFormRef = ref<FormInstance | null>(null);
let courseForm = reactive<CourseForm>({
  facultyId: 0,
  facultyName: '',
  teacherId: 0,
  teacherName: '',
  code: '',
  name: '',
  credit: 0,
  courseDescription: '',
})
const facultySelectorVisible = ref<boolean>(false)
const teacherSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetCourseAddEvent'): void;
  (e: 'closeCourseAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  facultyName: [
    { required: true, message: '请输入院系名称', trigger: 'blur' }
  ],
  teacherName: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入课程代码', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  credit: [
    { required: true, message: '请输入学分', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initCourseFormById(props.id)
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

const initCourseFormById = async (id: number) => {
  const resp: Result<Course> = await courseApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(courseForm, resp.data)
  }
}

const onReset = () => {
  if (courseFormRef.value) {
    courseFormRef.value.resetFields()
  }
  emit('resetCourseAddEvent')
}

const onSave = () => {
  if (!courseFormRef.value) {
    return
  }
  courseFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await courseApi.save(courseForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeCourseAddEvent', {search: true})
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
  if (selectedFaculty && 'facultyId' in selectedFaculty && courseForm.facultyId !== selectedFaculty['facultyId']) {
    courseForm.facultyId = selectedFaculty['facultyId']
    courseForm.facultyName = selectedFaculty['facultyName']
  }
}
const findTeacher = () => {
  teacherSelectorVisible.value = true
}

const handleTeacherSelectedEvent = (selectedTeacher: any) => {
  teacherSelectorVisible.value = false
  if (selectedTeacher && 'teacherId' in selectedTeacher && courseForm.teacherId !== selectedTeacher['teacherId']) {
    courseForm.teacherId = selectedTeacher['teacherId']
    courseForm.teacherName = selectedTeacher['teacherName']
  }
}

const onBack = () => {
  emit('closeCourseAddEvent')
}
</script>

<style lang="scss">
</style>
