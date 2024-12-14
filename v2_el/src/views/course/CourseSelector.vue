<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="院系名称" prop="facultyName">
          <el-input v-model="searchParams.facultyName" placeholder="请选择院系名称" readonly="readonly">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="findFaculty"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="教师姓名" prop="teacherName">
          <el-input v-model="searchParams.teacherName" placeholder="请选择教师姓名" readonly="readonly">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="findTeacher"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="课程名称">
            <el-input v-model="searchParams.name" placeholder="请输入课程名称" maxlength="64"></el-input>
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
        @row-dblclick="courseSelected">
      <el-table-column prop="facultyId" label="院系id"></el-table-column>
      <el-table-column prop="teacherId" label="教师id"></el-table-column>
      <el-table-column prop="code" label="课程代码"></el-table-column>
      <el-table-column prop="name" label="课程名称"></el-table-column>
      <el-table-column prop="credit" label="学分"></el-table-column>
        <el-table-column label="课程描述">
          <template v-slot="{ row }">
            <div class="ellipsis">
              {{ row.courseDescription }}
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
    <el-dialog :visible.sync="teacherSelectorVisible" v-if="teacherSelectorVisible" title="教师信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <teacher-selector @teacher-selected-event="handleTeacherSelectedEvent">
      </teacher-selector>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from '@/api/courseApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherSelector from "@/views/teacher/TeacherSelector.vue";
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'CourseSelector',
  components: {FacultySelector,TeacherSelector,},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        facultyId: '',
        facultyName: '',
        teacherId: '',
        teacherName: '',
        name: ''
      },
      facultySelectorVisible: false,
      teacherSelectorVisible: false,
    }
  },
  methods: {
    getPageData (p) {
      return courseApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        facultyId: '',
        facultyName: '',
        teacherId: '',
        teacherName: '',
        name: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    courseSelected (row) {
      this.$emit('course-selected-event', {
        courseId: row.id,
        courseName: row.name,
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
    findTeacher () {
      this.teacherSelectorVisible = true
    },
    handleTeacherSelectedEvent (selectedTeacher) {
      this.teacherSelectorVisible = false
      if (selectedTeacher && 'teacherId' in selectedTeacher && this.searchParams.teacherId !== selectedTeacher['teacherId']) {
        this.searchParams.teacherId = selectedTeacher['teacherId']
        this.searchParams.teacherName = selectedTeacher['teacherName']
      }
    },
    onBack () {
      this.$emit('course-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
