<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="studentQueryForm" ref="studentQueryFormRef" :rules="rules">
        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="studentQueryForm.studentNumber" placeholder="请输入学号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="studentQueryForm.gender" placeholder="请选择性别" class="select-custom">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业名称" prop="majorName">
          <el-input v-model="studentQueryForm.majorName" placeholder="请选择专业名称" readonly="readonly">
            <template #suffix>
              <el-icon @click="findMajor"><Search/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input-number v-model="studentQueryForm.grade" :min="2000" :max="2100"></el-input-number>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="studentQueryForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
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
        @row-dblclick="studentSelected">
        <el-table-column prop="studentNumber" label="学号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="gender" label="性别">
          <template v-slot="{ row }">
            <div v-if="row.gender === 1">男</div>
            <div v-if="row.gender === 2">女</div>
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="出生日期"></el-table-column>
        <el-table-column prop="majorName" label="专业名称"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="provinceName" label="省"></el-table-column>
        <el-table-column prop="cityName" label="市"></el-table-column>
        <el-table-column prop="areaName" label="区"></el-table-column>
        <el-table-column prop="address" label="家庭地址"></el-table-column>
        <el-table-column prop="enrollmentDate" label="入学日期"></el-table-column>
        <el-table-column prop="graduationDate" label="毕业日期"></el-table-column>
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
    <el-dialog v-model="majorSelectorVisible" v-if="majorSelectorVisible" title="专业信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <major-selector @major-selected-event="handleMajorSelectedEvent">
      </major-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import studentApi from '@/api/studentApi'
import type {StudentQueryForm} from "@/types/req/studentQueryForm";
import type {Student} from "@/types/resp/student";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import MajorSelector from "@/views/major/MajorSelector.vue";

const studentQueryFormRef = ref<FormInstance | null>(null);
let studentQueryForm = reactive<StudentQueryForm>({
  studentNumber: '',
  gender: undefined,
  majorId: 0,
  majorName: '',
  grade: 0,
  contactPhone: '',
})
const majorSelectorVisible = ref<boolean>(false)

const state = reactive({
  loading: false,
  tableData: [] as Student[], // 数据列表
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
  (e: 'studentSelectedEvent', data?: {
    studentId: number,
    studentNumber: string,
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
    const resp: Result<Page<Student>> = await studentApi.find(studentQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
        const page: Page<Student> = resp.data
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
  if (studentQueryFormRef.value) {
    studentQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const studentSelected = (row: Student) => {
  emit('studentSelectedEvent', {
    studentId: row.id,
    studentNumber: row.studentNumber,
  })
}

const findMajor = () => {
  majorSelectorVisible.value = true
}

const handleMajorSelectedEvent = (selectedMajor: any) => {
  majorSelectorVisible.value = false
  if (selectedMajor && 'majorId' in selectedMajor && studentQueryForm.majorId !== selectedMajor['majorId']) {
    studentQueryForm.majorId = selectedMajor['majorId']
    studentQueryForm.majorName = selectedMajor['majorName']
  }
}

const onBack = () => {
  emit('studentSelectedEvent')
}
</script>

<style lang="scss">
</style>
