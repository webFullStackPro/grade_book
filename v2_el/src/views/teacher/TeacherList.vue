<template>
  <div class="teacher-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>教师信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
    <el-dialog :visible.sync="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
    <el-dialog :visible.sync="teacherAddVisible" v-if="teacherAddVisible" :title="teacherAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <teacher-add :id="selectedTeacherId" @close-teacher-add-event="handleCloseTeacherAddEvent" @reset-teacher-add-event="handleResetTeacherAddEvent">
      </teacher-add>
    </el-dialog>
    <el-dialog :visible.sync="teacherViewVisible" v-if="teacherViewVisible" title="教师信息详情" :top="dialogTop" :width="dialogWidth">
      <teacher-view :id="selectedTeacherId" @close-teacher-view-event="handleCloseTeacherViewEvent">
      </teacher-view>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from '@/api/teacherApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import TeacherAdd from "@/views/teacher/TeacherAdd.vue"
import TeacherView from "@/views/teacher/TeacherView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'TeacherList',
  components: {FacultySelector,TeacherAdd, TeacherView},
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
      facultySelectorVisible: false,
      teacherAddVisible: false,
      teacherAddTitle: '',
      teacherViewVisible: false,
      selectedTeacherId: 0
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
    onAdd () {
      this.selectedTeacherId = ''
      this.teacherAddVisible = true
      this.teacherAddTitle = '教师信息新增'
    },
    onExport () {
      const headers = ['院系名称', '姓名', '职称', '性别', '联系电话', '邮箱', '教师简介']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.facultyName, d.name, this.getTitleText(d.title), this.getGenderText(d.gender), d.contactPhone, d.email, d.profile])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    getTitleText (title) {
      if (title === 1) {
        return '助教'
      }
      if (title === 2) {
        return '讲师'
      }
      if (title === 3) {
        return '副教授'
      }
      if (title === 4) {
        return '教授'
      }
    },
    editRow(id) {
      this.selectedTeacherId = id
      this.teacherAddVisible = true
      this.teacherAddTitle = '教师信息编辑'
    },
    delRow(id) {
      if (!id) {
        return
      }
      this.$confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherApi.del(id)
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
      this.selectedTeacherId = id
      this.teacherViewVisible = true
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
    handleCloseTeacherViewEvent () {
      this.teacherViewVisible = false
    },
    handleResetTeacherAddEvent () {
      this.teacherAddTitle = '教师信息新增'
    },
    handleCloseTeacherAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.teacherAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>