<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="studentSelected">
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
      <el-table-column prop="majorId" label="专业id"></el-table-column>
      <el-table-column prop="grade" label="年级"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="provinceName" label="省"></el-table-column>
      <el-table-column prop="cityName" label="市"></el-table-column>
      <el-table-column prop="areaName" label="区"></el-table-column>
      <el-table-column prop="address" label="家庭地址"></el-table-column>
      <el-table-column prop="enrollmentDate" label="入学日期"></el-table-column>
      <el-table-column prop="graduationDate" label="毕业日期"></el-table-column>
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
    <el-dialog :visible.sync="majorSelectorVisible" v-if="majorSelectorVisible" title="专业信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <major-selector @major-selected-event="handleMajorSelectedEvent">
      </major-selector>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from '@/api/studentApi'
import MajorSelector from "@/views/major/MajorSelector.vue";
import listQueryMixin from '@/mixins/listQueryMixin'

export default {
  name: 'StudentSelector',
  components: {MajorSelector,},
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
      majorSelectorVisible: false
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
    studentSelected (row) {
      this.$emit('student-selected-event', {
        studentId: row.id,
        studentNumber: row.studentNumber,
      })
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
    onBack () {
      this.$emit('student-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
