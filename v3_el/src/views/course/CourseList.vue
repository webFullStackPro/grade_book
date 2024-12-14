<template>
  <div class="course-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
    <el-dialog v-model="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
    <el-dialog v-model="teacherSelectorVisible" v-if="teacherSelectorVisible" title="教师信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <teacher-selector @teacher-selected-event="handleTeacherSelectedEvent">
      </teacher-selector>
    </el-dialog>
    <el-dialog v-model="courseAddVisible" v-if="courseAddVisible" :title="courseAddTitle" :top="dialogTop" :width="dialogWidth">
      <course-add :id="selectedCourseId" @close-course-add-event="handleCloseCourseAddEvent" @reset-course-add-event="handleResetCourseAddEvent">
      </course-add>
    </el-dialog>
    <el-dialog v-model="courseViewVisible" v-if="courseViewVisible" title="课程信息详情" :top="dialogTop" :width="dialogWidth">
      <course-view :id="selectedCourseId" @close-course-view-event="handleCloseCourseViewEvent">
      </course-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, reactive, ref, toRefs} from 'vue';
import courseApi from '@/api/courseApi'
import type {CourseQueryForm} from "@/types/req/courseQueryForm";
import type {Course} from "@/types/resp/course";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import {Search} from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherSelector from "@/views/teacher/TeacherSelector.vue";
import CourseAdd from "@/views/course/CourseAdd.vue"
import CourseView from "@/views/course/CourseView.vue"
import {exportToExcel} from "@/composables/exportUtil.ts";

const courseQueryFormRef = ref<FormInstance | null>(null);
let courseQueryForm = reactive<CourseQueryForm>({
  facultyId: 0,
  facultyName: '',
  teacherId: 0,
  teacherName: '',
  name: '',
})

const state = reactive({
  loading: false,
  tableData: [] as Course[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedCourseId = ref<number>(0)
const facultySelectorVisible = ref<boolean>(false)
const teacherSelectorVisible = ref<boolean>(false)
const courseAddVisible = ref<boolean>(false)
const courseViewVisible = ref<boolean>(false)
const courseAddTitle = ref<string>('')
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

const onAdd = () => {
  selectedCourseId.value = 0
  courseAddVisible.value = true
  courseAddTitle.value = '课程信息新增'
}
const editRow = (id: number) => {
  selectedCourseId.value = id
  courseAddVisible.value = true
  courseAddTitle.value = '课程信息编辑'
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
    courseApi.del(id)
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
  selectedCourseId.value = id
  courseViewVisible.value = true
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

const handleCloseCourseViewEvent = () => {
  courseViewVisible.value = false
}

const handleResetCourseAddEvent = () => {
  courseAddTitle.value = '课程信息新增'
}

const handleCloseCourseAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  courseAddVisible.value = false
}

const onExport = () => {
  const headers = ['院系名称', '教师姓名', '课程代码', '课程名称', '学分', '课程描述']
  courseApi.find(courseQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.facultyName, d.teacherName, d.code, d.name, d.credit, d.courseDescription])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
