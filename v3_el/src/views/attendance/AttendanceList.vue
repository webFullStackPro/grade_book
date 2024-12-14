<template>
  <div class="attendance-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>考勤信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="attendanceQueryForm" ref="attendanceQueryFormRef" :rules="rules">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="attendanceQueryForm.courseName" placeholder="请选择课程名称" readonly="readonly">
          <template #suffix>
            <el-icon @click="findCourse"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="学生学号" prop="studentNumber">
        <el-input v-model="attendanceQueryForm.studentNumber" placeholder="请选择学生学号" readonly="readonly">
          <template #suffix>
            <el-icon @click="findStudent"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="attendanceQueryForm.status" placeholder="请选择状态" class="select-custom">
          <el-option label="出勤" :value="10"></el-option>
          <el-option label="缺勤" :value="20"></el-option>
          <el-option label="迟到" :value="30"></el-option>
        </el-select>
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
      <el-table-column prop="attendanceDate" label="考勤日期"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <div v-if="row.status === 10">出勤</div>
          <div v-if="row.status === 20">缺勤</div>
          <div v-if="row.status === 30">迟到</div>
        </template>
      </el-table-column>
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
    <el-dialog v-model="attendanceAddVisible" v-if="attendanceAddVisible" :title="attendanceAddTitle" :top="dialogTop" :width="dialogWidth">
      <attendance-add :id="selectedAttendanceId" @close-attendance-add-event="handleCloseAttendanceAddEvent" @reset-attendance-add-event="handleResetAttendanceAddEvent">
      </attendance-add>
    </el-dialog>
    <el-dialog v-model="attendanceViewVisible" v-if="attendanceViewVisible" title="考勤信息详情" :top="dialogTop" :width="dialogWidth">
      <attendance-view :id="selectedAttendanceId" @close-attendance-view-event="handleCloseAttendanceViewEvent">
      </attendance-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, reactive, ref, toRefs} from 'vue';
import attendanceApi from '@/api/attendanceApi'
import type {AttendanceQueryForm} from "@/types/req/attendanceQueryForm";
import type {Attendance} from "@/types/resp/attendance";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import {Search} from '@element-plus/icons-vue';
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
import AttendanceAdd from "@/views/attendance/AttendanceAdd.vue"
import AttendanceView from "@/views/attendance/AttendanceView.vue"
import {exportToExcel} from "@/composables/exportUtil.ts";
import {getAttendanceStatusText} from "@/composables/dictTranslator.ts";

const attendanceQueryFormRef = ref<FormInstance | null>(null);
let attendanceQueryForm = reactive<AttendanceQueryForm>({
  courseId: 0,
  courseName: '',
  studentId: 0,
  studentNumber: '',
  status: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as Attendance[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedAttendanceId = ref<number>(0)
const courseSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const attendanceAddVisible = ref<boolean>(false)
const attendanceViewVisible = ref<boolean>(false)
const attendanceAddTitle = ref<string>('')
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
    const resp: Result<Page<Attendance>> = await attendanceApi.find(attendanceQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Attendance> = resp.data
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
  if (attendanceQueryFormRef.value) {
    attendanceQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedAttendanceId.value = 0
  attendanceAddVisible.value = true
  attendanceAddTitle.value = '考勤信息新增'
}
const editRow = (id: number) => {
  selectedAttendanceId.value = id
  attendanceAddVisible.value = true
  attendanceAddTitle.value = '考勤信息编辑'
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
    attendanceApi.del(id)
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
  selectedAttendanceId.value = id
  attendanceViewVisible.value = true
}

const findCourse = () => {
  courseSelectorVisible.value = true
}

const handleCourseSelectedEvent = (selectedCourse: any) => {
  courseSelectorVisible.value = false
  if (selectedCourse && 'courseId' in selectedCourse && attendanceQueryForm.courseId !== selectedCourse['courseId']) {
    attendanceQueryForm.courseId = selectedCourse['courseId']
    attendanceQueryForm.courseName = selectedCourse['courseName']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && attendanceQueryForm.studentId !== selectedStudent['studentId']) {
    attendanceQueryForm.studentId = selectedStudent['studentId']
    attendanceQueryForm.studentNumber = selectedStudent['studentNumber']
  }
}

const handleCloseAttendanceViewEvent = () => {
  attendanceViewVisible.value = false
}

const handleResetAttendanceAddEvent = () => {
  attendanceAddTitle.value = '考勤信息新增'
}

const handleCloseAttendanceAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  attendanceAddVisible.value = false
}

const onExport = () => {
  const headers = ['课程名称', '学生学号', '考勤日期', '状态']
  attendanceApi.find(attendanceQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.courseName, d.studentNumber, d.attendanceDate, getAttendanceStatusText(d.status)])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
