<template>
  <div class="teacher-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>教师信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="teacherQueryForm" ref="teacherQueryFormRef" :rules="rules">
      <el-form-item label="院系名称" prop="facultyName">
        <el-input v-model="teacherQueryForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
          <template #suffix>
            <el-icon @click="findFaculty"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="teacherQueryForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="职称" prop="title">
        <el-select v-model="teacherQueryForm.title" placeholder="请选择职称" class="select-custom">
          <el-option label="助教" :value="1"></el-option>
          <el-option label="讲师" :value="2"></el-option>
          <el-option label="副教授" :value="3"></el-option>
          <el-option label="教授" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="teacherQueryForm.gender" placeholder="请选择性别" class="select-custom">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="teacherQueryForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
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
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="title" label="职称">
        <template v-slot="{ row }">
          <div v-if="row.title === 1">助教</div>
          <div v-if="row.title === 2">讲师</div>
          <div v-if="row.title === 3">副教授</div>
          <div v-if="row.title === 4">教授</div>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别">
        <template v-slot="{ row }">
          <div v-if="row.gender === 1">男</div>
          <div v-if="row.gender === 2">女</div>
        </template>
      </el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="教师简介">
        <template v-slot="{ row }">
          <div class="ellipsis">
            {{ row.profile }}
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
    <el-dialog v-model="teacherAddVisible" v-if="teacherAddVisible" :title="teacherAddTitle" :top="dialogTop" :width="dialogWidth">
      <teacher-add :id="selectedTeacherId" @close-teacher-add-event="handleCloseTeacherAddEvent" @reset-teacher-add-event="handleResetTeacherAddEvent">
      </teacher-add>
    </el-dialog>
    <el-dialog v-model="teacherViewVisible" v-if="teacherViewVisible" title="教师信息详情" :top="dialogTop" :width="dialogWidth">
      <teacher-view :id="selectedTeacherId" @close-teacher-view-event="handleCloseTeacherViewEvent">
      </teacher-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import teacherApi from '@/api/teacherApi'
import type {TeacherQueryForm} from "@/types/req/teacherQueryForm";
import type {Teacher} from "@/types/resp/teacher";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherAdd from "@/views/teacher/TeacherAdd.vue"
import TeacherView from "@/views/teacher/TeacherView.vue"
import { getTitleText, getGenderText } from "@/composables/dictTranslator"
import {exportToExcel} from "@/composables/exportUtil";


const teacherQueryFormRef = ref<FormInstance | null>(null);
let teacherQueryForm = reactive<TeacherQueryForm>({
  facultyId: 0,
  facultyName: '',
  name: '',
  title: undefined,
  gender: undefined,
  contactPhone: '',
})

const state = reactive({
  loading: false,
  tableData: [] as Teacher[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedTeacherId = ref<number>(0)
const facultySelectorVisible = ref<boolean>(false)
const teacherAddVisible = ref<boolean>(false)
const teacherViewVisible = ref<boolean>(false)
const teacherAddTitle = ref<string>('')
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
    const resp: Result<Page<Teacher>> = await teacherApi.find(teacherQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Teacher> = resp.data
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
  if (teacherQueryFormRef.value) {
    teacherQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedTeacherId.value = 0
  teacherAddVisible.value = true
  teacherAddTitle.value = '教师信息新增'
}
const editRow = (id: number) => {
  selectedTeacherId.value = id
  teacherAddVisible.value = true
  teacherAddTitle.value = '教师信息编辑'
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
    teacherApi.del(id)
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
  selectedTeacherId.value = id
  teacherViewVisible.value = true
}

const findFaculty = () => {
  facultySelectorVisible.value = true
}

const handleFacultySelectedEvent = (selectedFaculty: any) => {
  facultySelectorVisible.value = false
  if (selectedFaculty && 'facultyId' in selectedFaculty && teacherQueryForm.facultyId !== selectedFaculty['facultyId']) {
    teacherQueryForm.facultyId = selectedFaculty['facultyId']
    teacherQueryForm.facultyName = selectedFaculty['facultyName']
  }
}

const handleCloseTeacherViewEvent = () => {
  teacherViewVisible.value = false
}

const handleResetTeacherAddEvent = () => {
  teacherAddTitle.value = '教师信息新增'
}

const handleCloseTeacherAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  teacherAddVisible.value = false
}

const onExport = () => {
  const headers = ['院系名称', '姓名', '职称', '性别', '联系电话', '邮箱', '教师简介']
  teacherApi.find(teacherQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.facultyName, d.name, getTitleText(d.title), getGenderText(d.gender), d.contactPhone, d.email, d.profile])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
