<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="teacherForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系名称">
            <el-input v-model="teacherForm.facultyName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="teacherForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="密码">
            <el-input v-model="teacherForm.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="职称">
            <el-select v-model="teacherForm.title" placeholder="请选择职称">
              <el-option label="助教" :value="1"></el-option>
              <el-option label="讲师" :value="2"></el-option>
              <el-option label="副教授" :value="3"></el-option>
              <el-option label="教授" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="性别">
            <el-select v-model="teacherForm.gender" placeholder="请选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="teacherForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮箱">
            <el-input v-model="teacherForm.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="教师简介" prop="profile">
            <el-input v-model="teacherForm.profile" placeholder="请输入教师简介" type="textarea" :rows="5" maxlength="65535"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="teacherForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="teacherForm.modifyTime"></el-input>
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
import teacherApi from '@/api/teacherApi'
export default {
  name: 'TeacherView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      teacherForm: {
      }
    }
  },
  created () {
    if (this.id) {
      teacherApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.teacherForm = resp.data
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
      this.$emit('close-teacher-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>