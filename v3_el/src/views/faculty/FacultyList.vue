<template>
  <div class="faculty-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>院系信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="facultyQueryForm" ref="facultyQueryFormRef" :rules="rules">
      <el-form-item label="学校名称" prop="universityName">
        <el-input v-model="facultyQueryForm.universityName" placeholder="请选择学校名称" readonly="readonly">
          <template #suffix>
            <el-icon @click="findUniversity"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="院系名称" prop="name">
        <el-input v-model="facultyQueryForm.name" placeholder="请输入院系名称" maxlength="64"></el-input>
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
      <el-table-column prop="universityName" label="学校名称"></el-table-column>
      <el-table-column prop="name" label="院系名称"></el-table-column>
      <el-table-column prop="establishmentDate" label="成立日期"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="officeLocation" label="办公地点"></el-table-column>
      <el-table-column prop="website" label="院系网址"></el-table-column>
      <el-table-column label="院系简介">
        <template v-slot="{ row }">
          <div class="ellipsis">
            {{ row.facultyDescription }}
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
    <el-dialog v-model="universitySelectorVisible" v-if="universitySelectorVisible" title="学校信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <university-selector @university-selected-event="handleUniversitySelectedEvent">
      </university-selector>
    </el-dialog>
    <el-dialog v-model="facultyAddVisible" v-if="facultyAddVisible" :title="facultyAddTitle" :top="dialogTop" :width="dialogWidth">
      <faculty-add :id="selectedFacultyId" @close-faculty-add-event="handleCloseFacultyAddEvent" @reset-faculty-add-event="handleResetFacultyAddEvent">
      </faculty-add>
    </el-dialog>
    <el-dialog v-model="facultyViewVisible" v-if="facultyViewVisible" title="院系信息详情" :top="dialogTop" :width="dialogWidth">
      <faculty-view :id="selectedFacultyId" @close-faculty-view-event="handleCloseFacultyViewEvent">
      </faculty-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import facultyApi from '@/api/facultyApi'
import type {FacultyQueryForm} from "@/types/req/facultyQueryForm";
import type {Faculty} from "@/types/resp/faculty";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import UniversitySelector from "@/views/university/UniversitySelector.vue";
import FacultyAdd from "@/views/faculty/FacultyAdd.vue"
import FacultyView from "@/views/faculty/FacultyView.vue"

const facultyQueryFormRef = ref<FormInstance | null>(null);
let facultyQueryForm = reactive<FacultyQueryForm>({
  universityId: 0,
  universityName: '',
  name: '',
})

const state = reactive({
  loading: false,
  tableData: [] as Faculty[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedFacultyId = ref<number>(0)
const universitySelectorVisible = ref<boolean>(false)
const facultyAddVisible = ref<boolean>(false)
const facultyViewVisible = ref<boolean>(false)
const facultyAddTitle = ref<string>('')
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
    const resp: Result<Page<Faculty>> = await facultyApi.find(facultyQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Faculty> = resp.data
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
  if (facultyQueryFormRef.value) {
    facultyQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedFacultyId.value = 0
  facultyAddVisible.value = true
  facultyAddTitle.value = '院系信息新增'
}
const editRow = (id: number) => {
  selectedFacultyId.value = id
  facultyAddVisible.value = true
  facultyAddTitle.value = '院系信息编辑'
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
    facultyApi.del(id)
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
  selectedFacultyId.value = id
  facultyViewVisible.value = true
}

const findUniversity = () => {
  universitySelectorVisible.value = true
}

const handleUniversitySelectedEvent = (selectedUniversity: any) => {
  universitySelectorVisible.value = false
  if (selectedUniversity && 'universityId' in selectedUniversity && facultyQueryForm.universityId !== selectedUniversity['universityId']) {
    facultyQueryForm.universityId = selectedUniversity['universityId']
    facultyQueryForm.universityName = selectedUniversity['universityName']
  }
}

const handleCloseFacultyViewEvent = () => {
  facultyViewVisible.value = false
}

const handleResetFacultyAddEvent = () => {
  facultyAddTitle.value = '院系信息新增'
}

const handleCloseFacultyAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  facultyAddVisible.value = false
}
</script>

<style lang="scss">
</style>
