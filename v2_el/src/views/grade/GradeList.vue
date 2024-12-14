<template>
  <div class="grade-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成绩信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="searchParams.courseName" placeholder="请选择课程名称" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findCourse"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="学生学号" prop="studentNumber">
        <el-input v-model="searchParams.studentNumber" placeholder="请选择学生学号" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findStudent"></i>
        </el-input>
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
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="studentNumber" label="学生学号"></el-table-column>
      <el-table-column prop="grade" label="成绩"></el-table-column>
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
    <el-dialog :visible.sync="courseSelectorVisible" v-if="courseSelectorVisible" title="课程信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <course-selector @course-selected-event="handleCourseSelectedEvent">
      </course-selector>
    </el-dialog>
    <el-dialog :visible.sync="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
    <el-dialog :visible.sync="gradeAddVisible" v-if="gradeAddVisible" :title="gradeAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <grade-add :id="selectedGradeId" @close-grade-add-event="handleCloseGradeAddEvent" @reset-grade-add-event="handleResetGradeAddEvent">
      </grade-add>
    </el-dialog>
    <el-dialog :visible.sync="gradeViewVisible" v-if="gradeViewVisible" title="成绩信息详情" :top="dialogTop" :width="dialogWidth">
      <grade-view :id="selectedGradeId" @close-grade-view-event="handleCloseGradeViewEvent">
      </grade-view>
    </el-dialog>
  </div>
</template>

<script>
import gradeApi from '@/api/gradeApi'
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
import GradeAdd from "@/views/grade/GradeAdd.vue"
import GradeView from "@/views/grade/GradeView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'GradeList',
  components: {CourseSelector,StudentSelector,GradeAdd, GradeView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        courseId: '',
        courseName: '',
        studentId: '',
        studentNumber: '',
      },
      courseSelectorVisible: false,
      studentSelectorVisible: false,
      gradeAddVisible: false,
      gradeAddTitle: '',
      gradeViewVisible: false,
      selectedGradeId: 0
    }
  },
  methods: {
    getPageData (p) {
      return gradeApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        courseId: '',
        courseName: '',
        studentId: '',
        studentNumber: '',
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedGradeId = ''
      this.gradeAddVisible = true
      this.gradeAddTitle = '成绩信息新增'
    },
    onExport () {
      const headers = ['课程名称', '学生学号', '成绩']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.courseName, d.studentNumber, d.grade])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    editRow (id) {
      this.selectedGradeId = id
      this.gradeAddVisible = true
      this.gradeAddTitle = '成绩信息编辑'
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
        gradeApi.del(id)
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
      this.selectedGradeId = id
      this.gradeViewVisible = true
    },
    findCourse () {
      this.courseSelectorVisible = true
    },
    handleCourseSelectedEvent (selectedCourse) {
      this.courseSelectorVisible = false
      if (selectedCourse && 'courseId' in selectedCourse && this.searchParams.courseId !== selectedCourse['courseId']) {
        this.searchParams.courseId = selectedCourse['courseId']
        this.searchParams.courseName = selectedCourse['courseName']
      }
    },
    findStudent () {
      this.studentSelectorVisible = true
    },
    handleStudentSelectedEvent (selectedStudent) {
      this.studentSelectorVisible = false
      if (selectedStudent && 'studentId' in selectedStudent && this.searchParams.studentId !== selectedStudent['studentId']) {
        this.searchParams.studentId = selectedStudent['studentId']
        this.searchParams.studentNumber = selectedStudent['studentNumber']
      }
    },
    handleCloseGradeViewEvent () {
      this.gradeViewVisible = false
    },
    handleResetGradeAddEvent () {
      this.gradeAddTitle = '成绩信息新增'
    },
    handleCloseGradeAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.gradeAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>