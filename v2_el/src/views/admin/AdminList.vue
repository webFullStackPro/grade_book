<template>
  <div class="admin-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="用户名">
        <el-input v-model="searchParams.username" placeholder="请输入用户名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchParams.name" placeholder="请输入姓名" maxlength="64"></el-input>
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
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
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
    <el-dialog :visible.sync="adminAddVisible" v-if="adminAddVisible" :title="adminAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <admin-add :id="selectedAdminId" @close-admin-add-event="handleCloseAdminAddEvent" @reset-admin-add-event="handleResetAdminAddEvent">
      </admin-add>
    </el-dialog>
    <el-dialog :visible.sync="adminViewVisible" v-if="adminViewVisible" title="管理员详情" :top="dialogTop" :width="dialogWidth">
      <admin-view :id="selectedAdminId" @close-admin-view-event="handleCloseAdminViewEvent">
      </admin-view>
    </el-dialog>
  </div>
</template>

<script>
import adminApi from '@/api/adminApi'
import AdminAdd from "@/views/admin/AdminAdd.vue"
import AdminView from "@/views/admin/AdminView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'AdminList',
  components: {AdminAdd, AdminView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        username: '',
        name: ''
      },
      adminAddVisible: false,
      adminAddTitle: '',
      adminViewVisible: false,
      selectedAdminId: 0
    }
  },
  methods: {
    getPageData (p) {
      return adminApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        username: '',
        name: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedAdminId = ''
      this.adminAddVisible = true
      this.adminAddTitle = '管理员新增'
    },
    editRow (id) {
      this.selectedAdminId = id
      this.adminAddVisible = true
      this.adminAddTitle = '管理员编辑'
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
        adminApi.del(id)
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
      this.selectedAdminId = id
      this.adminViewVisible = true
    },
    handleCloseAdminViewEvent () {
      this.adminViewVisible = false
    },
    handleResetAdminAddEvent () {
      this.adminAddTitle = '管理员新增'
    },
    handleCloseAdminAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.adminAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>