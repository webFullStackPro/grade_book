<template>
  <div class="student-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学生信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="学号">
        <el-input v-model="searchParams.studentNumber" placeholder="请输入学号" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="searchParams.gender" placeholder="请选择性别">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业名称" prop="majorName">
        <el-input v-model="searchParams.majorName" placeholder="请选择专业名称" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findMajor"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-input-number v-model="searchParams.grade" :min="2000" :max="2100"></el-input-number>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="searchParams.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
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
    <el-dialog :visible.sync="majorSelectorVisible" v-if="majorSelectorVisible" title="专业信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <major-selector @major-selected-event="handleMajorSelectedEvent">
      </major-selector>
    </el-dialog>
    <el-dialog :visible.sync="studentAddVisible" v-if="studentAddVisible" :title="studentAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <student-add :id="selectedStudentId" @close-student-add-event="handleCloseStudentAddEvent" @reset-student-add-event="handleResetStudentAddEvent">
      </student-add>
    </el-dialog>
    <el-dialog :visible.sync="studentViewVisible" v-if="studentViewVisible" title="学生信息详情" :top="dialogTop" :width="dialogWidth">
      <student-view :id="selectedStudentId" @close-student-view-event="handleCloseStudentViewEvent">
      </student-view>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from '@/api/studentApi'
import MajorSelector from "@/views/major/MajorSelector.vue";
import StudentAdd from "@/views/student/StudentAdd.vue"
import StudentView from "@/views/student/StudentView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'StudentList',
  components: {MajorSelector,StudentAdd, StudentView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        studentNumber: '',
        gender: '',
        majorId: '',
        majorName: '',
        grade: '',
        contactPhone: ''
      },
      majorSelectorVisible: false,
      studentAddVisible: false,
      studentAddTitle: '',
      studentViewVisible: false,
      selectedStudentId: 0
    }
  },
  methods: {
    getPageData (p) {
      return studentApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        studentNumber: '',
        gender: '',
        majorId: '',
        majorName: '',
        grade: '',
        contactPhone: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedStudentId = ''
      this.studentAddVisible = true
      this.studentAddTitle = '学生信息新增'
    },
    onExport () {
      const headers = ['学号', '姓名', '性别', '出生日期', '专业名称', '年级', '联系电话', '邮箱', '省', '市', '区', '家庭地址', '入学日期', '毕业日期']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.studentNumber, d.name, this.getGenderText(d.gender), d.birthDate, d.majorName, d.grade, d.contactPhone, d.email,
            d.provinceName, d.cityName, d.areaName, d.address, d.enrollmentDate, d.graduationDate])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    editRow (id) {
      this.selectedStudentId = id
      this.studentAddVisible = true
      this.studentAddTitle = '学生信息编辑'
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
        studentApi.del(id)
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
      this.selectedStudentId = id
      this.studentViewVisible = true
    },
    findMajor () {
      this.majorSelectorVisible = true
    },
    handleMajorSelectedEvent (selectedMajor) {
      this.majorSelectorVisible = false
      if (selectedMajor && 'majorId' in selectedMajor && this.searchParams.majorId !== selectedMajor['majorId']) {
        this.searchParams.majorId = selectedMajor['majorId']
        this.searchParams.majorName = selectedMajor['majorName']
      }
    },
    handleCloseStudentViewEvent () {
      this.studentViewVisible = false
    },
    handleResetStudentAddEvent () {
      this.studentAddTitle = '学生信息新增'
    },
    handleCloseStudentAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.studentAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>