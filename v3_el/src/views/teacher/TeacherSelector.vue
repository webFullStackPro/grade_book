<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="state.tableData"
        border
        v-loading="state.loading"
        size="small"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="teacherSelected">
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
    <el-dialog v-model="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import teacherApi from '@/api/teacherApi'
import type {TeacherQueryForm} from "@/types/req/teacherQueryForm";
import type {Teacher} from "@/types/resp/teacher";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import FacultySelector from "@/views/faculty/FacultySelector.vue";

const teacherQueryFormRef = ref<FormInstance | null>(null);
let teacherQueryForm = reactive<TeacherQueryForm>({
  facultyId: 0,
  facultyName: '',
  name: '',
  title: undefined,
  gender: undefined,
  contactPhone: '',
})
const facultySelectorVisible = ref<boolean>(false)

const state = reactive({
  loading: false,
  tableData: [] as Teacher[], // 数据列表
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
  (e: 'teacherSelectedEvent', data?: {
    teacherId: number,
    teacherName: string,
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

const teacherSelected = (row: Teacher) => {
  emit('teacherSelectedEvent', {
    teacherId: row.id,
    teacherName: row.name,
  })
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

const onBack = () => {
  emit('teacherSelectedEvent')
}
</script>

<style lang="scss">
</style>
