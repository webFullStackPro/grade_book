<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="facultyForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="学校名称">
            <el-input v-model="facultyForm.universityName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="院系名称">
            <el-input v-model="facultyForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="成立日期">
            <el-input v-model="facultyForm.establishmentDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="facultyForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮箱">
            <el-input v-model="facultyForm.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="办公地点">
            <el-input v-model="facultyForm.officeLocation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系网址">
            <el-input v-model="facultyForm.website"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="院系简介">
            <el-input v-model="facultyForm.facultyDescription" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="facultyForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="facultyForm.modifyTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="12" :offset="6">
          <div class="form-button-container">
            <el-button @click="onBack" type="primary">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import facultyApi from '@/api/facultyApi'
export default {
  name: 'FacultyView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      facultyForm: {
      }
    }
  },
  created () {
    if (this.id) {
      facultyApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.facultyForm = resp.data
            } else {
              this.$message.error('获取数据失败')
            }
          })
          .catch(error => {
            console.error('获取数据失败:', error)
          })
    }
  },
  methods: {
    onBack () {
      this.$emit('close-faculty-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>