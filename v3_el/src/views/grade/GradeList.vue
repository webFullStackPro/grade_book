<template>
  <div class="grade-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成绩信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="gradeQueryForm" ref="gradeQueryFormRef" :rules="rules">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="gradeQueryForm.courseName" placeholder="请选择课程名称" readonly="readonly">
          <template #suffix>
            <el-icon @click="findCourse"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="学生学号" prop="studentNumber">
        <el-input v-model="gradeQueryForm.studentNumber" placeholder="请选择学生学号" readonly="readonly">
          <template #suffix>
            <el-icon @click="findStudent"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="state.tableData"
      border
      v-loading="state.loading"
      size="small"
      header-cell-class-name="table-header-cell-font"
      cell-class-name="table-cell-font">
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="studentNumber" label="学生学号"></el-table-column>
      <el-table-column prop="grade" label="成绩"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template v-slot="{ row }">
          <el-button @click.native.prevent="editRow(row.id)" type="primary">编辑</el-button>
          <el-button @click.native.prevent="delRow(row.id)" type="danger" plain>删除</el-button>
          <el-button @click.native.prevent="detailRow(row.id)" type="primary" plain>详情</el-button>
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
    <el-dialog v-model="courseSelectorVisible" v-if="courseSelectorVisible" title="课程信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <course-selector @course-selected-event="handleCourseSelectedEvent">
      </course-selector>
    </el-dialog>
    <el-dialog v-model="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
    <el-dialog v-model="gradeAddVisible" v-if="gradeAddVisible" :title="gradeAddTitle" :top="dialogTop" :width="dialogWidth">
      <grade-add :id="selectedGradeId" @close-grade-add-event="handleCloseGradeAddEvent" @reset-grade-add-event="handleResetGradeAddEvent">
      </grade-add>
    </el-dialog>
    <el-dialog v-model="gradeViewVisible" v-if="gradeViewVisible" title="成绩信息详情" :top="dialogTop" :width="dialogWidth">
      <grade-view :id="selectedGradeId" @close-grade-view-event="handleCloseGradeViewEvent">
      </grade-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, reactive, ref, toRefs} from 'vue';
import gradeApi from '@/api/gradeApi'
import type {GradeQueryForm} from "@/types/req/gradeQueryForm";
import type {Grade} from "@/types/resp/grade";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import {Search} from '@element-plus/icons-vue';
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
import GradeAdd from "@/views/grade/GradeAdd.vue"
import GradeView from "@/views/grade/GradeView.vue"
import {exportToExcel} from "@/composables/exportUtil.ts";

const gradeQueryFormRef = ref<FormInstance | null>(null);
let gradeQueryForm = reactive<GradeQueryForm>({
  courseId: 0,
  courseName: '',
  studentId: 0,
  studentNumber: '',
})

const state = reactive({
  loading: false,
  tableData: [] as Grade[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedGradeId = ref<number>(0)
const courseSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const gradeAddVisible = ref<boolean>(false)
const gradeViewVisible = ref<boolean>(false)
const gradeAddTitle = ref<string>('')
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

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
    const resp: Result<Page<Grade>> = await gradeApi.find(gradeQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Grade> = resp.data
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
  if (gradeQueryFormRef.value) {
    gradeQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedGradeId.value = 0
  gradeAddVisible.value = true
  gradeAddTitle.value = '成绩信息新增'
}
const editRow = (id: number) => {
  selectedGradeId.value = id
  gradeAddVisible.value = true
  gradeAddTitle.value = '成绩信息编辑'
}
const delRow = (id: number) => {
  if (!id) {
    return
  }
  ElMessageBox.confirm(
    '确定要删除吗?',
    '删除提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    gradeApi.del(id)
      .then((resp) => {
        if (resp && resp.code === 1) {
          ElMessage.success('删除成功!')
          onSearch()
        } else {
          ElMessage.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
        }
      })
      .catch(error => {
        console.error('操作失败:', error)
      })
  }).catch(() => {})
}
const detailRow = (id:number) => {
  selectedGradeId.value = id
  gradeViewVisible.value = true
}

const findCourse = () => {
  courseSelectorVisible.value = true
}

const handleCourseSelectedEvent = (selectedCourse: any) => {
  courseSelectorVisible.value = false
  if (selectedCourse && 'courseId' in selectedCourse && gradeQueryForm.courseId !== selectedCourse['courseId']) {
    gradeQueryForm.courseId = selectedCourse['courseId']
    gradeQueryForm.courseName = selectedCourse['courseName']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && gradeQueryForm.studentId !== selectedStudent['studentId']) {
    gradeQueryForm.studentId = selectedStudent['studentId']
    gradeQueryForm.studentNumber = selectedStudent['studentNumber']
  }
}

const handleCloseGradeViewEvent = () => {
  gradeViewVisible.value = false
}

const handleResetGradeAddEvent = () => {
  gradeAddTitle.value = '成绩信息新增'
}

const handleCloseGradeAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  gradeAddVisible.value = false
}

const onExport = () => {
  const headers = ['课程名称', '学生学号', '成绩']
  gradeApi.find(gradeQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.courseName, d.studentNumber, d.grade])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
