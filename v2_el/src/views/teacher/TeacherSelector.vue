<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="院系名称" prop="facultyName">
          <el-input v-model="searchParams.facultyName" placeholder="请选择院系名称" readonly="readonly">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="findFaculty"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="姓名">
            <el-input v-model="searchParams.name" placeholder="请输入姓名" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="searchParams.title" placeholder="请选择职称">
            <el-option label="助教" :value="1"></el-option>
            <el-option label="讲师" :value="2"></el-option>
            <el-option label="副教授" :value="3"></el-option>
            <el-option label="教授" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="searchParams.gender" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input v-model="searchParams.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="teacherSelected">
        <el-table-column prop="facultyId" label="院系id"></el-table-column>
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
          @current-change="paginationChange"
          :current-page="pageData.current"
          :page-sizes="pageData.pageSizes"
          :page-size="pageData.size"
          background
          layout="total, prev, pager, next, jumper"
          :total="pageData.count">
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
    <el-dialog :visible.sync="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from '@/api/teacherApi'
import listQueryMixin from '@/mixins/listQueryMixin'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
export default {
  name: 'TeacherSelector',
  components: {FacultySelector},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: '',
        title: '',
        gender: '',
        contactPhone: ''
      },
      facultySelectorVisible: false
    }
  },
  methods: {
    getPageData (p) {
      return teacherApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        name: '',
        title: '',
        gender: '',
        contactPhone: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    teacherSelected (row) {
      this.$emit('teacher-selected-event', {
        teacherId: row.id,
        teacherName: row.name,
      })
    },
    findFaculty () {
      this.facultySelectorVisible = true
    },
    handleFacultySelectedEvent (selectedFaculty) {
      this.facultySelectorVisible = false
      if (selectedFaculty && 'facultyId' in selectedFaculty && this.searchParams.facultyId !== selectedFaculty['facultyId']) {
        this.searchParams.facultyId = selectedFaculty['facultyId']
        this.searchParams.facultyName = selectedFaculty['facultyName']
      }
    },
    onBack () {
      this.$emit('teacher-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
