<template>
  <div class="major-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>专业信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="院系名称" prop="facultyName">
        <el-input v-model="searchParams.facultyName" placeholder="请选择院系名称" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findFaculty"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="专业名称">
        <el-input v-model="searchParams.name" placeholder="请输入专业名称" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="学位类型" prop="degreeType">
        <el-select v-model="searchParams.degreeType" placeholder="请选择学位类型">
          <el-option label="学士" :value="1"></el-option>
          <el-option label="硕士" :value="2"></el-option>
          <el-option label="博士" :value="3"></el-option>
        </el-select>
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
      <el-table-column prop="facultyName" label="院系名称"></el-table-column>
      <el-table-column prop="name" label="专业名称"></el-table-column>
      <el-table-column prop="degreeType" label="学位类型">
        <template v-slot="{ row }">
          <div v-if="row.degreeType === 1">学士</div>
          <div v-if="row.degreeType === 2">硕士</div>
          <div v-if="row.degreeType === 3">博士</div>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="学制(年)"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="officeLocation" label="办公地点"></el-table-column>
      <el-table-column label="专业简介">
        <template v-slot="{ row }">
          <div class="ellipsis">
            {{ row.majorDescription }}
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
    <el-dialog :visible.sync="majorAddVisible" v-if="majorAddVisible" :title="majorAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <major-add :id="selectedMajorId" @close-major-add-event="handleCloseMajorAddEvent" @reset-major-add-event="handleResetMajorAddEvent">
      </major-add>
    </el-dialog>
    <el-dialog :visible.sync="majorViewVisible" v-if="majorViewVisible" title="专业信息详情" :top="dialogTop" :width="dialogWidth">
      <major-view :id="selectedMajorId" @close-major-view-event="handleCloseMajorViewEvent">
      </major-view>
    </el-dialog>
  </div>
</template>

<script>
import majorApi from '@/api/majorApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import MajorAdd from "@/views/major/MajorAdd.vue"
import MajorView from "@/views/major/MajorView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'MajorList',
  components: {FacultySelector,MajorAdd, MajorView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        facultyId: '',
        facultyName: '',
        name: '',
        degreeType: ''
      },
      facultySelectorVisible: false,
      majorAddVisible: false,
      majorAddTitle: '',
      majorViewVisible: false,
      selectedMajorId: 0
    }
  },
  methods: {
    getPageData (p) {
      return majorApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        facultyId: '',
        facultyName: '',
        name: '',
        degreeType: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedMajorId = ''
      this.majorAddVisible = true
      this.majorAddTitle = '专业信息新增'
    },
    editRow (id) {
      this.selectedMajorId = id
      this.majorAddVisible = true
      this.majorAddTitle = '专业信息编辑'
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
        majorApi.del(id)
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
      this.selectedMajorId = id
      this.majorViewVisible = true
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
    handleCloseMajorViewEvent () {
      this.majorViewVisible = false
    },
    handleResetMajorAddEvent () {
      this.majorAddTitle = '专业信息新增'
    },
    handleCloseMajorAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.majorAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>