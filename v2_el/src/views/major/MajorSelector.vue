<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="majorSelected">
      <el-table-column prop="facultyId" label="院系id"></el-table-column>
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
    <el-dialog :visible.sync="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
  </div>
</template>

<script>
import majorApi from '@/api/majorApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'MajorSelector',
  components: {FacultySelector,},
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
    majorSelected (row) {
      this.$emit('major-selected-event', {
        majorId: row.id,
        majorName: row.name,
      })
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
    onBack () {
      this.$emit('major-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
