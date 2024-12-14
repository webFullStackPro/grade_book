<template>
  <div class="major-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>专业信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="majorQueryForm" ref="majorQueryFormRef" :rules="rules">
      <el-form-item label="院系名称" prop="facultyName">
        <el-input v-model="majorQueryForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
          <template #suffix>
            <el-icon @click="findFaculty"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="专业名称" prop="name">
        <el-input v-model="majorQueryForm.name" placeholder="请输入专业名称" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="学位类型" prop="degreeType">
        <el-select v-model="majorQueryForm.degreeType" placeholder="请选择学位类型" class="select-custom">
          <el-option label="学士" :value="1"></el-option>
          <el-option label="硕士" :value="2"></el-option>
          <el-option label="博士" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
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
      <el-table-column prop="name" label="专业名称"></el-table-column>
      <el-table-column prop="degreeType" label="学位类型">
        <template v-slot="{ row }">
          <div v-if="row.degreeType === 1">学士</div>
          <div v-if="row.degreeType === 2">硕士</div>
          <div v-if="row.degreeType === 3">博士</div>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="学制(年)"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="officeLocation" label="办公地点"></el-table-column>
      <el-table-column label="专业简介">
        <template v-slot="{ row }">
          <div class="ellipsis">
            {{ row.majorDescription }}
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
    <el-dialog v-model="majorAddVisible" v-if="majorAddVisible" :title="majorAddTitle" :top="dialogTop" :width="dialogWidth">
      <major-add :id="selectedMajorId" @close-major-add-event="handleCloseMajorAddEvent" @reset-major-add-event="handleResetMajorAddEvent">
      </major-add>
    </el-dialog>
    <el-dialog v-model="majorViewVisible" v-if="majorViewVisible" title="专业信息详情" :top="dialogTop" :width="dialogWidth">
      <major-view :id="selectedMajorId" @close-major-view-event="handleCloseMajorViewEvent">
      </major-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import majorApi from '@/api/majorApi'
import type {MajorQueryForm} from "@/types/req/majorQueryForm";
import type {Major} from "@/types/resp/major";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import MajorAdd from "@/views/major/MajorAdd.vue"
import MajorView from "@/views/major/MajorView.vue"

const majorQueryFormRef = ref<FormInstance | null>(null);
let majorQueryForm = reactive<MajorQueryForm>({
  facultyId: 0,
  facultyName: '',
  name: '',
  degreeType: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as Major[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedMajorId = ref<number>(0)
const facultySelectorVisible = ref<boolean>(false)
const majorAddVisible = ref<boolean>(false)
const majorViewVisible = ref<boolean>(false)
const majorAddTitle = ref<string>('')
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
    const resp: Result<Page<Major>> = await majorApi.find(majorQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Major> = resp.data
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
  if (majorQueryFormRef.value) {
    majorQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedMajorId.value = 0
  majorAddVisible.value = true
  majorAddTitle.value = '专业信息新增'
}
const editRow = (id: number) => {
  selectedMajorId.value = id
  majorAddVisible.value = true
  majorAddTitle.value = '专业信息编辑'
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
    majorApi.del(id)
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
  selectedMajorId.value = id
  majorViewVisible.value = true
}

const findFaculty = () => {
  facultySelectorVisible.value = true
}

const handleFacultySelectedEvent = (selectedFaculty: any) => {
  facultySelectorVisible.value = false
  if (selectedFaculty && 'facultyId' in selectedFaculty && majorQueryForm.facultyId !== selectedFaculty['facultyId']) {
    majorQueryForm.facultyId = selectedFaculty['facultyId']
    majorQueryForm.facultyName = selectedFaculty['facultyName']
  }
}

const handleCloseMajorViewEvent = () => {
  majorViewVisible.value = false
}

const handleResetMajorAddEvent = () => {
  majorAddTitle.value = '专业信息新增'
}

const handleCloseMajorAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  majorAddVisible.value = false
}
</script>

<style lang="scss">
</style>
