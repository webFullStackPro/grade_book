<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="state.tableData"
        border
        v-loading="state.loading"
        size="small"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="facultySelected">
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
    <el-dialog v-model="universitySelectorVisible" v-if="universitySelectorVisible" title="学校信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <university-selector @university-selected-event="handleUniversitySelectedEvent">
      </university-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import facultyApi from '@/api/facultyApi'
import type {FacultyQueryForm} from "@/types/req/facultyQueryForm";
import type {Faculty} from "@/types/resp/faculty";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import UniversitySelector from "@/views/university/UniversitySelector.vue";

const facultyQueryFormRef = ref<FormInstance | null>(null);
let facultyQueryForm = reactive<FacultyQueryForm>({
  universityId: 0,
  universityName: '',
  name: '',
})
const universitySelectorVisible = ref<boolean>(false)

const state = reactive({
  loading: false,
  tableData: [] as Faculty[], // 数据列表
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
  (e: 'facultySelectedEvent', data?: {
    facultyId: number,
    facultyName: string,
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

const facultySelected = (row: Faculty) => {
  emit('facultySelectedEvent', {
    facultyId: row.id,
    facultyName: row.name,
  })
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

const onBack = () => {
  emit('facultySelectedEvent')
}
</script>

<style lang="scss">
</style>
