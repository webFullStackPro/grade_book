<template>
  <div class="header">
    <div class="header-title">{{ $t('title') }}</div>
    <div class="middle"><span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span><a href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a></div>
    <div class="header__nav">
      <el-dropdown @command="handleCommand">
          <span class="nav-link" style="cursor: pointer;">
            {{settingsName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="updatePass">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :visible.sync="updatePassFormVisible" title="修改密码" width="400">
      <el-form ref="updatePassFormRef" :model="updatePassForm" :rules="rules" size="medium">
        <el-form-item label="旧密码" :label-width="updatePassFormLabelWidth" prop="oldPass">
          <el-input v-model="updatePassForm.oldPass" autocomplete="off" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" :label-width="updatePassFormLabelWidth" prop="newPass">
          <el-input v-model="updatePassForm.newPass" autocomplete="off" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" :label-width="updatePassFormLabelWidth" prop="newPass2">
          <el-input v-model="updatePassForm.newPass2" autocomplete="off" placeholder="请输入确认新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="updatePass()" :loading="loading">保存</el-button>
          <el-button @click="updatePassFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import userApi from "@/api/userApi";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Header',
  data () {
    return {
      updatePassFormVisible: false,
      updatePassFormLabelWidth: '120px',
      rules: {
        oldPass: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        newPass2: [
          { required: true, message: '确认新密码不能为空', trigger: 'blur' }
        ]
      },
      updatePassForm: {
        oldPass: '',
        newPass: '',
        newPass2: '',
        type: ''
      },
      loading: false,
      settingsName: '设置'
    }
  },
  mounted () {
    const type = sessionStorage.getItem('type')
    const username = sessionStorage.getItem('username')
    if (type && Number(type) === 1) {
      this.settingsName = '管理员-' + username
    }
    if (type && Number(type) === 2) {
      this.settingsName = '教师-' + username
    }
    if (type && Number(type) === 3) {
      this.settingsName = '学生-' + username
    }
    this.updatePassForm.type = type
  },
  methods: {
    onLogout () {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.logout()
          .then(() => {
            this.clearSessionAndBackToLoginPage()
          })
          .catch(error => {
            console.log('退出失败', error)
            this.$message.error('退出失败')
          })
      }).catch(() => {})
    },
    clearSessionAndBackToLoginPage () {
      sessionStorage.removeItem('backendToken')
      sessionStorage.removeItem('type')
      sessionStorage.removeItem('uid')
      sessionStorage.removeItem('username')
      this.$router.replace({ path: '/Login' }).catch(error => { console.log('退出异常', error) })
    },
    handleCommand (command) {
      if (command === 'updatePass') {
        this.updatePassFormVisible = true
        this.updatePassForm = {
          oldPass: '',
          newPass: '',
          newPass2: '',
          type: sessionStorage.getItem('type')
        }
      }
      if (command === 'logout') {
        this.onLogout()
      }
    },
    updatePass () {
      if (this.updatePassForm.newPass !== this.updatePassForm.newPass2) {
        this.$message.error('两次输入的新密码不一致')
        return
      }
      this.$refs.updatePassFormRef.validate(async (valid) => {
        if (valid) {
          if ('admin' === sessionStorage.getItem('username')) {
            this.$message.error('admin密码无法修改，可新增其他用户名的管理员进行操作')
            return
          }
          if ('teacher_test_1' === sessionStorage.getItem('username')) {
            this.$message.error('teacher_test_1密码无法修改，可注册其他用户名的教师进行操作')
            return
          }
          if ('student_test_1' === sessionStorage.getItem('username')) {
            this.$message.error('student_test_1密码无法修改，可注册其他用户名的学生进行操作')
            return
          }
          this.loading = true
          userApi.updatePass(this.updatePassForm)
            .then(resp => {
              if (resp && resp.code === 1) {
                this.$message({ message: '修改密码成功', type: 'success' })
                this.loading = false
                this.updatePassFormVisible = false
              } else {
                this.$message.error(resp.msg ? resp.msg : '修改密码失败')
                this.loading = false
              }
            })
            .catch(error => {
              console.log('修改密码失败', error)
              this.$message.error('修改密码失败')
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/var";

.header {
  height: 100%;
  background: $primary-color;
  margin: 0 -20px;
  box-shadow: 0 1px 1px 0 $box-shadow-base;
  display: flex;
  justify-content: space-between; /* 水平方向上两端对齐 */
  align-items: center;            /* 垂直居中 */

  .header-title {
    color: #ffffff;
  }

  .middle {
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 59px;
    a {
      color: #ffffff;
      padding: 0 5px;
    }
  }

  .header-title {
    font-weight: bold;             /* 加粗字体 */
    padding-left: 20px;
    font-size: 24px;
  }

  .setting button {
    margin-left: 10px;             /* 按钮与文本间留些空间 */
  }

  @at-root #{&}__nav {
    float: right;
    margin-right: 50px;
    .nav-link {
      padding: 7px 10px;
      color: #ffffff;
    }
  }
}
</style>
