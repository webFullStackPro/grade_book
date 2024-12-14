<template>
  <div class="course-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
        <el-button type="primary" @click="onAdd">新增</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pageData.list"
      border
      v-loading="pageData.loading"
      size="mini"
      header-cell-class-name="table-header-cell-font"
      cell-class-name="table-cell-font">
      <el-table-column prop="facultyName" label="院系名称"></el-table-column>
      <el-table-column prop="teacherName" label="教师姓名"></el-table-column>
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
        @current-change="paginationChange"
        :current-page="pageData.current"
        :page-sizes="pageData.pageSizes"
        :page-size="pageData.size"
        background
        layout="total, prev, pager, next, jumper"
        :total="pageData.count">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
    <el-dialog :visible.sync="teacherSelectorVisible" v-if="teacherSelectorVisible" title="教师信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <teacher-selector @teacher-selected-event="handleTeacherSelectedEvent">
      </teacher-selector>
    </el-dialog>
    <el-dialog :visible.sync="courseAddVisible" v-if="courseAddVisible" :title="courseAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <course-add :id="selectedCourseId" @close-course-add-event="handleCloseCourseAddEvent" @reset-course-add-event="handleResetCourseAddEvent">
      </course-add>
    </el-dialog>
    <el-dialog :visible.sync="courseViewVisible" v-if="courseViewVisible" title="课程信息详情" :top="dialogTop" :width="dialogWidth">
      <course-view :id="selectedCourseId" @close-course-view-event="handleCloseCourseViewEvent">
      </course-view>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from '@/api/courseApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherSelector from "@/views/teacher/TeacherSelector.vue";
import CourseAdd from "@/views/course/CourseAdd.vue"
import CourseView from "@/views/course/CourseView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'CourseList',
  components: {FacultySelector,TeacherSelector,CourseAdd, CourseView},
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
      courseAddVisible: false,
      courseAddTitle: '',
      courseViewVisible: false,
      selectedCourseId: 0
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
    onAdd () {
      this.selectedCourseId = ''
      this.courseAddVisible = true
      this.courseAddTitle = '课程信息新增'
    },
    onExport () {
      const headers = ['院系名称', '教师姓名', '课程代码', '课程名称', '学分', '课程描述']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.facultyName, d.teacherName, d.code, d.name, d.credit, d.courseDescription])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    editRow (id) {
      this.selectedCourseId = id
      this.courseAddVisible = true
      this.courseAddTitle = '课程信息编辑'
    },
    delRow (id) {
      if (!id) {
        return
      }
      this.$confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseApi.del(id)
          .then((resp) => {
            if (resp && resp.code === 1) {
              this.$message.success('删除成功!')
              this.onSearch()
            } else {
              this.$message.error('删除失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          })
          .catch(error => {
            console.error('操作失败:', error)
          })
      }).catch(() => {})
    },
    detailRow (id) {
      this.selectedCourseId = id
      this.courseViewVisible = true
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
    handleCloseCourseViewEvent () {
      this.courseViewVisible = false
    },
    handleResetCourseAddEvent () {
      this.courseAddTitle = '课程信息新增'
    },
    handleCloseCourseAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.courseAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>