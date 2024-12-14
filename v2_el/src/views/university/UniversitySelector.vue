<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="universitySelected">
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
  </div>
</template>

<script>
import universityApi from '@/api/universityApi'
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'UniversitySelector',
  components: {},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: '',
        location: ''
      },
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
    universitySelected (row) {
      this.$emit('university-selected-event', {
        universityId: row.id,
        universityName: row.name,
      })
    },
    onBack () {
      this.$emit('university-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
