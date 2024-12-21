<template>
  <div class="attendance-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>考勤信息列表</el-breadcrumb-item>
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchParams.status" placeholder="请选择状态">
          <el-option label="出勤" :value="10"></el-option>
          <el-option label="缺勤" :value="20"></el-option>
          <el-option label="迟到" :value="30"></el-option>
        </el-select>
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
      <el-table-column prop="attendanceDate" label="考勤日期"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <div v-if="row.status === 10">出勤</div>
          <div v-if="row.status === 20">缺勤</div>
          <div v-if="row.status === 30">迟到</div>
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
    <el-dialog :visible.sync="courseSelectorVisible" v-if="courseSelectorVisible" title="课程信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <course-selector @course-selected-event="handleCourseSelectedEvent">
      </course-selector>
    </el-dialog>
    <el-dialog :visible.sync="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
    <el-dialog :visible.sync="attendanceAddVisible" v-if="attendanceAddVisible" :title="attendanceAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <attendance-add :id="selectedAttendanceId" @close-attendance-add-event="handleCloseAttendanceAddEvent" @reset-attendance-add-event="handleResetAttendanceAddEvent">
      </attendance-add>
    </el-dialog>
    <el-dialog :visible.sync="attendanceViewVisible" v-if="attendanceViewVisible" title="考勤信息详情" :top="dialogTop" :width="dialogWidth">
      <attendance-view :id="selectedAttendanceId" @close-attendance-view-event="handleCloseAttendanceViewEvent">
      </attendance-view>
    </el-dialog>
  </div>
</template>

<script>
import attendanceApi from '@/api/attendanceApi'
import CourseSelector from "@/views/course/CourseSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
import AttendanceAdd from "@/views/attendance/AttendanceAdd.vue"
import AttendanceView from "@/views/attendance/AttendanceView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
import {getAttendanceStatusText} from "@/utils/dictTranslator";
export default {
  name: 'AttendanceList',
  components: {CourseSelector,StudentSelector,AttendanceAdd, AttendanceView},
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
        status: ''
      },
      courseSelectorVisible: false,
      studentSelectorVisible: false,
      attendanceAddVisible: false,
      attendanceAddTitle: '',
      attendanceViewVisible: false,
      selectedAttendanceId: 0
    }
  },
  methods: {
    getPageData (p) {
      return attendanceApi.find(p)
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
        status: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedAttendanceId = ''
      this.attendanceAddVisible = true
      this.attendanceAddTitle = '考勤信息新增'
    },
    onExport () {
      const headers = ['课程名称', '学生学号', '考勤日期', '状态']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.courseName, d.studentNumber, d.attendanceDate, getAttendanceStatusText(d.status)])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    editRow(id) {
      this.selectedAttendanceId = id
      this.attendanceAddVisible = true
      this.attendanceAddTitle = '考勤信息编辑'
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
        attendanceApi.del(id)
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
      this.selectedAttendanceId = id
      this.attendanceViewVisible = true
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
    handleCloseAttendanceViewEvent () {
      this.attendanceViewVisible = false
    },
    handleResetAttendanceAddEvent () {
      this.attendanceAddTitle = '考勤信息新增'
    },
    handleCloseAttendanceAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.attendanceAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>