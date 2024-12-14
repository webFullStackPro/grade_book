<template>
  <div class="university-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学校信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="universityQueryForm" ref="universityQueryFormRef" :rules="rules">
      <el-form-item label="学校名称" prop="name">
        <el-input v-model="universityQueryForm.name" placeholder="请输入学校名称" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="location">
        <el-input v-model="universityQueryForm.location" placeholder="请输入地址" maxlength="255"></el-input>
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
      <el-table-column prop="name" label="学校名称"></el-table-column>
      <el-table-column prop="establishmentDate" label="成立日期"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="provinceName" label="省"></el-table-column>
      <el-table-column prop="cityName" label="市"></el-table-column>
      <el-table-column prop="areaName" label="区"></el-table-column>
      <el-table-column prop="location" label="地址"></el-table-column>
      <el-table-column label="学校简介">
        <template v-slot="{ row }">
          <div class="ellipsis">
            {{ row.universityDescription }}
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
    <el-dialog v-model="universityAddVisible" v-if="universityAddVisible" :title="universityAddTitle" :top="dialogTop" :width="dialogWidth">
      <university-add :id="selectedUniversityId" @close-university-add-event="handleCloseUniversityAddEvent" @reset-university-add-event="handleResetUniversityAddEvent">
      </university-add>
    </el-dialog>
    <el-dialog v-model="universityViewVisible" v-if="universityViewVisible" title="学校信息详情" :top="dialogTop" :width="dialogWidth">
      <university-view :id="selectedUniversityId" @close-university-view-event="handleCloseUniversityViewEvent">
      </university-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import universityApi from '@/api/universityApi'
import type {UniversityQueryForm} from "@/types/req/universityQueryForm";
import type {University} from "@/types/resp/university";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import UniversityAdd from "@/views/university/UniversityAdd.vue"
import UniversityView from "@/views/university/UniversityView.vue"

const universityQueryFormRef = ref<FormInstance | null>(null);
let universityQueryForm = reactive<UniversityQueryForm>({
  name: '',
  location: '',
})

const state = reactive({
  loading: false,
  tableData: [] as University[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedUniversityId = ref<number>(0)
const universityAddVisible = ref<boolean>(false)
const universityViewVisible = ref<boolean>(false)
const universityAddTitle = ref<string>('')
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
    const resp: Result<Page<University>> = await universityApi.find(universityQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<University> = resp.data
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
  if (universityQueryFormRef.value) {
    universityQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedUniversityId.value = 0
  universityAddVisible.value = true
  universityAddTitle.value = '学校信息新增'
}
const editRow = (id: number) => {
  selectedUniversityId.value = id
  universityAddVisible.value = true
  universityAddTitle.value = '学校信息编辑'
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
    universityApi.del(id)
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
  selectedUniversityId.value = id
  universityViewVisible.value = true
}


const handleCloseUniversityViewEvent = () => {
  universityViewVisible.value = false
}

const handleResetUniversityAddEvent = () => {
  universityAddTitle.value = '学校信息新增'
}

const handleCloseUniversityAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  universityAddVisible.value = false
}
</script>

<style lang="scss">
</style>
