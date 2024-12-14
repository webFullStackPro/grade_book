<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="courseQueryForm" ref="courseQueryFormRef" :rules="rules">
        <el-form-item label="院系名称" prop="facultyName">
          <el-input v-model="courseQueryForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
            <template #suffix>
              <el-icon @click="findFaculty"><Search/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="教师姓名" prop="teacherName">
          <el-input v-model="courseQueryForm.teacherName" placeholder="请选择教师姓名" readonly="readonly">
            <template #suffix>
              <el-icon @click="findTeacher"><Search/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseQueryForm.name" placeholder="请输入课程名称" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="state.tableData"
        border
        v-loading="state.loading"
        size="small"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="courseSelected">
        <el-table-column prop="facultyName" label="院系名称"></el-table-column>
        <el-table-column prop="teacherName" label="教师姓名"></el-table-column>
        <el-table-column prop="code" label="课程代码"></el-table-column>
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column prop="credit" label="学分"></el-table-column>
        <el-table-column label="课程描述">
          <template v-slot="{ row }">
            <div class="ellipsis">
              {{ row.courseDescription }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          @current-change="changePage"
          :current-page="state.currentPage"
          :page-sizes="state.pageSizes"
          :page-size="state.pageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="state.total">
        </el-pagination>
      </div>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
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
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import courseApi from '@/api/courseApi'
import type {CourseQueryForm} from "@/types/req/courseQueryForm";
import type {Course} from "@/types/resp/course";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherSelector from "@/views/teacher/TeacherSelector.vue";

const courseQueryFormRef = ref<FormInstance | null>(null);
let courseQueryForm = reactive<CourseQueryForm>({
  facultyId: 0,
  facultyName: '',
  teacherId: 0,
  teacherName: '',
  name: '',
})
const facultySelectorVisible = ref<boolean>(false)
const teacherSelectorVisible = ref<boolean>(false)

const state = reactive({
  loading: false,
  tableData: [] as Course[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})

const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

const emit = defineEmits<{
  (e: 'courseSelectedEvent', data?: {
    courseId: number,
    courseName: string,
    }): void;
}>()

onMounted(() => {
  onSearch()
  const globalState = inject('globalState', {} as { dialogWidth?: string, dialogTop?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.dialogWidth) {
    dialogWidth.value = globalStateRefs.dialogWidth.value || ''
  }
  if (globalStateRefs.dialogTop) {
    dialogTop.value = globalStateRefs.dialogTop.value || ''
  }
})

const getPageData = async () => {
  try {
    state.loading = true
    const resp: Result<Page<Course>> = await courseApi.find(courseQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
        const page: Page<Course> = resp.data
        if (page && page.list.length > 0) {
          state.tableData = page.list
          state.total = page.total
        }
      }
    }
  } catch (e) {
    console.log('获取数据异常', e)
  } finally {
    state.loading = false
  }
}
const onSearch = () => {
  getPageData()
}

const changePage = (val: number) => {
  state.currentPage = val
  getPageData()
}

const onReset = () => {
  if (courseQueryFormRef.value) {
    courseQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const courseSelected = (row: Course) => {
  emit('courseSelectedEvent', {
    courseId: row.id,
    courseName: row.name,
  })
}

const findFaculty = () => {
  facultySelectorVisible.value = true
}

const handleFacultySelectedEvent = (selectedFaculty: any) => {
  facultySelectorVisible.value = false
  if (selectedFaculty && 'facultyId' in selectedFaculty && courseQueryForm.facultyId !== selectedFaculty['facultyId']) {
    courseQueryForm.facultyId = selectedFaculty['facultyId']
    courseQueryForm.facultyName = selectedFaculty['facultyName']
  }
}
const findTeacher = () => {
  teacherSelectorVisible.value = true
}

const handleTeacherSelectedEvent = (selectedTeacher: any) => {
  teacherSelectorVisible.value = false
  if (selectedTeacher && 'teacherId' in selectedTeacher && courseQueryForm.teacherId !== selectedTeacher['teacherId']) {
    courseQueryForm.teacherId = selectedTeacher['teacherId']
    courseQueryForm.teacherName = selectedTeacher['teacherName']
  }
}

const onBack = () => {
  emit('courseSelectedEvent')
}
</script>

<style lang="scss">
</style>
