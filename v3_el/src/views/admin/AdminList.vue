<template>
  <div class="admin-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="adminQueryForm" ref="adminQueryFormRef" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="adminQueryForm.username" placeholder="请输入用户名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="adminQueryForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
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
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
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
    <el-dialog v-model="adminAddVisible" v-if="adminAddVisible" :title="adminAddTitle" :top="dialogTop" :width="dialogWidth">
      <admin-add :id="selectedAdminId" @close-admin-add-event="handleCloseAdminAddEvent" @reset-admin-add-event="handleResetAdminAddEvent">
      </admin-add>
    </el-dialog>
    <el-dialog v-model="adminViewVisible" v-if="adminViewVisible" title="管理员详情" :top="dialogTop" :width="dialogWidth">
      <admin-view :id="selectedAdminId" @close-admin-view-event="handleCloseAdminViewEvent">
      </admin-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import adminApi from '@/api/adminApi'
import type {AdminQueryForm} from "@/types/req/adminQueryForm";
import type {Admin} from "@/types/resp/admin";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import AdminAdd from "@/views/admin/AdminAdd.vue"
import AdminView from "@/views/admin/AdminView.vue"

const adminQueryFormRef = ref<FormInstance | null>(null);
let adminQueryForm = reactive<AdminQueryForm>({
  username: '',
  name: '',
})

const state = reactive({
  loading: false,
  tableData: [] as Admin[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedAdminId = ref<number>(0)
const adminAddVisible = ref<boolean>(false)
const adminViewVisible = ref<boolean>(false)
const adminAddTitle = ref<string>('')
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
    const resp: Result<Page<Admin>> = await adminApi.find(adminQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Admin> = resp.data
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
  if (adminQueryFormRef.value) {
    adminQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedAdminId.value = 0
  adminAddVisible.value = true
  adminAddTitle.value = '管理员新增'
}
const editRow = (id: number) => {
  selectedAdminId.value = id
  adminAddVisible.value = true
  adminAddTitle.value = '管理员编辑'
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
    adminApi.del(id)
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
  selectedAdminId.value = id
  adminViewVisible.value = true
}


const handleCloseAdminViewEvent = () => {
  adminViewVisible.value = false
}

const handleResetAdminAddEvent = () => {
  adminAddTitle.value = '管理员新增'
}

const handleCloseAdminAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  adminAddVisible.value = false
}
</script>

<style lang="scss">
</style>