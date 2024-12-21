<template>
  <div class="header">
    <div class="header-title">{{ $t('title') }}</div>
    <div class="middle"><span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span><a href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a></div>
    <div class="header__nav">
      <el-dropdown @command="handleCommand">
        <span class="nav-link" style="cursor: pointer;">
          {{ settingsName }} <el-icon><i-ep-arrow-down/></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="updatePassCmd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logoutCmd">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <el-dialog  v-model="updatePassFormVisible" v-if="updatePassFormVisible" title="修改密码" width="800">
    <el-form ref="updatePassFormRef" :model="updatePassForm" :rules="rules">
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
        <el-button type="primary" @click="updatePassSubmit()" :loading="loading">保存</el-button>
        <el-button @click="updatePassFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox, type FormInstance} from 'element-plus'
import userApi from '@/api/userApi'
import {useRouter} from "vue-router";
import type {UpdatePassForm} from "@/types/req/updatePassForm";
import type {Result} from "@/types/result";

const settingsName = ref<string>('设置')
const router = useRouter()
const updatePassFormVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const updatePassFormRef = ref<FormInstance | null>(null);
const updatePassForm = reactive<UpdatePassForm>({
  oldPass: '',
  newPass: '',
  newPass2: ''
})
const updatePassFormLabelWidth = ref<string>('120px');

const rules = reactive({
  oldPass: [
    { required: true, message: '旧密码不能为空', trigger: 'blur' }
  ],
  newPass: [
    { required: true, message: '新密码不能为空', trigger: 'blur' }
  ],
  newPass2: [
    { required: true, message: '确认新密码不能为空', trigger: 'blur' }
  ]
});

onMounted(() => {
  const username = sessionStorage.getItem('username')
  if (username) {
    settingsName.value = username
  }
});
const handleCommand = (command: string) => {
  console.log('command', command)
  switch (command) {
    case 'updatePassCmd':
      updatePass()
      break;
    case 'logoutCmd':
      onLogout()
      break;
    case 'c':
    default:
      console.log('未定义的操作');
  }
}

const updatePass = () => {
  updatePassFormVisible.value = true
}
const updatePassSubmit = () => {

  if (!updatePassFormRef.value) {
    ElMessage.error('表单引用未初始化')
    return
  }
  updatePassFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const resp: Result<void> = await userApi.updatePass(updatePassForm)
      if (!resp || resp.code !== 1) {
        ElMessage.error(resp && resp.msg ? resp.msg : '操作异常')
        loading.value = false
        return
      }
      ElMessage({
        message: '修改密码成功',
        type: 'success',
        duration: 1000,
        onClose: () => {
          loading.value = true
          updatePassFormVisible.value = false
        }
      })
    }
  })
}

const onLogout = () => {
    ElMessageBox.confirm(
      '确定要退出吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      userApi.logout()
        .then(() => {
          clearSessionAndBackToLoginPage()
        })
        .catch(error => {
          console.log('退出失败', error)
          ElMessage.error('退出失败')
        })
    })
    .catch(() => {})
}
const clearSessionAndBackToLoginPage = () => {
  sessionStorage.removeItem('loginToken')
  sessionStorage.removeItem('type')
  sessionStorage.removeItem('uid')
  sessionStorage.removeItem('username')
  router.replace({ path: '/Login' }).catch(error => { console.log('退出异常', error) })
}
</script>

<style lang="scss">
.header {
  height: 100%;
  background: $primary-color;
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
    font-weight: bold; /* 加粗字体 */
    padding-left: 20px;
    font-size: 24px;
  }

  .setting button {
    margin-left: 10px; /* 按钮与文本间留些空间 */
  }

  @at-root #{&}__nav {
    display: flex;
    justify-content: space-between; /* 水平方向上两端对齐 */
    margin-right: 50px;
    .nav-link {
      line-height: 60px;
      margin-right: 10px;
      color: #ffffff;
    }
  }
}
</style>
