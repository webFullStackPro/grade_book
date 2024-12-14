<template>
  <div class="university-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学校信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="学校名称">
        <el-input v-model="searchParams.name" placeholder="请输入学校名称" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="searchParams.location" placeholder="请输入地址" maxlength="255"></el-input>
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
      <el-table-column prop="name" label="学校名称"></el-table-column>
      <el-table-column prop="establishmentDate" label="成立日期"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="provinceName" label="省"></el-table-column>
      <el-table-column prop="cityName" label="市"></el-table-column>
      <el-table-column prop="areaName" label="区"></el-table-column>
      <el-table-column prop="location" label="地址"></el-table-column>
      <el-table-column label="学校简介">
        <template v-slot="{ row }">
          <div class="ellipsis">
            {{ row.universityDescription }}
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
    <el-dialog :visible.sync="universityAddVisible" v-if="universityAddVisible" :title="universityAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <university-add :id="selectedUniversityId" @close-university-add-event="handleCloseUniversityAddEvent" @reset-university-add-event="handleResetUniversityAddEvent">
      </university-add>
    </el-dialog>
    <el-dialog :visible.sync="universityViewVisible" v-if="universityViewVisible" title="学校信息详情" :top="dialogTop" :width="dialogWidth">
      <university-view :id="selectedUniversityId" @close-university-view-event="handleCloseUniversityViewEvent">
      </university-view>
    </el-dialog>
  </div>
</template>

<script>
import universityApi from '@/api/universityApi'
import UniversityAdd from "@/views/university/UniversityAdd.vue"
import UniversityView from "@/views/university/UniversityView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'UniversityList',
  components: {UniversityAdd, UniversityView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: '',
        location: ''
      },
      universityAddVisible: false,
      universityAddTitle: '',
      universityViewVisible: false,
      selectedUniversityId: 0
    }
  },
  methods: {
    getPageData (p) {
      return universityApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        name: '',
        location: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedUniversityId = ''
      this.universityAddVisible = true
      this.universityAddTitle = '学校信息新增'
    },
    editRow (id) {
      this.selectedUniversityId = id
      this.universityAddVisible = true
      this.universityAddTitle = '学校信息编辑'
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
        universityApi.del(id)
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
      this.selectedUniversityId = id
      this.universityViewVisible = true
    },
    handleCloseUniversityViewEvent () {
      this.universityViewVisible = false
    },
    handleResetUniversityAddEvent () {
      this.universityAddTitle = '学校信息新增'
    },
    handleCloseUniversityAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.universityAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>