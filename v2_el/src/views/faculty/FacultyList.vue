<template>
  <div class="faculty-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>院系信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="学校名称" prop="universityName">
        <el-input v-model="searchParams.universityName" placeholder="请选择学校名称" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findUniversity"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="院系名称">
        <el-input v-model="searchParams.name" placeholder="请输入院系名称" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pageData.list"
      border
      v-loading="pageData.loading"
      size="mini"
      header-cell-class-name="table-header-cell-font"
      cell-class-name="table-cell-font">
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
    <el-dialog :visible.sync="universitySelectorVisible" v-if="universitySelectorVisible" title="学校信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <university-selector @university-selected-event="handleUniversitySelectedEvent">
      </university-selector>
    </el-dialog>
    <el-dialog :visible.sync="facultyAddVisible" v-if="facultyAddVisible" :title="facultyAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <faculty-add :id="selectedFacultyId" @close-faculty-add-event="handleCloseFacultyAddEvent" @reset-faculty-add-event="handleResetFacultyAddEvent">
      </faculty-add>
    </el-dialog>
    <el-dialog :visible.sync="facultyViewVisible" v-if="facultyViewVisible" title="院系信息详情" :top="dialogTop" :width="dialogWidth">
      <faculty-view :id="selectedFacultyId" @close-faculty-view-event="handleCloseFacultyViewEvent">
      </faculty-view>
    </el-dialog>
  </div>
</template>

<script>
import facultyApi from '@/api/facultyApi'
import UniversitySelector from "@/views/university/UniversitySelector.vue";
import FacultyAdd from "@/views/faculty/FacultyAdd.vue"
import FacultyView from "@/views/faculty/FacultyView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'FacultyList',
  components: {UniversitySelector,FacultyAdd, FacultyView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        universityId: '',
        universityName: '',
        name: ''
      },
      universitySelectorVisible: false,
      facultyAddVisible: false,
      facultyAddTitle: '',
      facultyViewVisible: false,
      selectedFacultyId: 0
    }
  },
  methods: {
    getPageData (p) {
      return facultyApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        universityId: '',
        universityName: '',
        name: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedFacultyId = ''
      this.facultyAddVisible = true
      this.facultyAddTitle = '院系信息新增'
    },
    editRow (id) {
      this.selectedFacultyId = id
      this.facultyAddVisible = true
      this.facultyAddTitle = '院系信息编辑'
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
        facultyApi.del(id)
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
      this.selectedFacultyId = id
      this.facultyViewVisible = true
    },
    findUniversity () {
      this.universitySelectorVisible = true
    },
    handleUniversitySelectedEvent (selectedUniversity) {
      this.universitySelectorVisible = false
      if (selectedUniversity && 'universityId' in selectedUniversity && this.searchParams.universityId !== selectedUniversity['universityId']) {
        this.searchParams.universityId = selectedUniversity['universityId']
        this.searchParams.universityName = selectedUniversity['universityName']
      }
    },
    handleCloseFacultyViewEvent () {
      this.facultyViewVisible = false
    },
    handleResetFacultyAddEvent () {
      this.facultyAddTitle = '院系信息新增'
    },
    handleCloseFacultyAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.facultyAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>