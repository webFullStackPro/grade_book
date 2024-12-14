<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="adminForm" :label-width="formLabelWidth" ref="refAdminForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adminForm.username" placeholder="请输入用户名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="密码" prop="password">
            <el-input v-model="adminForm.password" placeholder="请输入密码" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="adminForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import adminApi from '@/api/adminApi'
export default {
  name: 'AdminAdd',
  components: {},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      adminForm: {
        username: '',
        password: '',
        name: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    if (this.id) {
      adminApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.adminForm = resp.data
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
    onReset () {
      this.adminForm = {
        username: '',
        password: '',
        name: ''
      }
      this.$emit('reset-admin-add-event')
    },
    onSave () {
      this.$refs.refAdminForm.validate((valid) => {
        if (valid) {
          adminApi.save(this.adminForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-admin-add-event', {search: true})
              } else {
                this.$message.error('保存失败:' + (resp.msg ? resp.msg : ''))
              }
            })
            .catch(error => {
              console.log(error)
              this.$message.error('保存失败')
            })
        } else {
          return false
        }
      })
    },
    onBack () {
      this.$emit('close-admin-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>