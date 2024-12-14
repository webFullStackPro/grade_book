<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="state.tableData"
        border
        v-loading="state.loading"
        size="small"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="universitySelected">
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
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import universityApi from '@/api/universityApi'
import type {UniversityQueryForm} from "@/types/req/universityQueryForm";
import type {University} from "@/types/resp/university";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";

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

const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

const emit = defineEmits<{
  (e: 'universitySelectedEvent', data?: {
    universityId: number,
    universityName: string,
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

const universitySelected = (row: University) => {
  emit('universitySelectedEvent', {
    universityId: row.id,
    universityName: row.name,
  })
}


const onBack = () => {
  emit('universitySelectedEvent')
}
</script>

<style lang="scss">
</style>
