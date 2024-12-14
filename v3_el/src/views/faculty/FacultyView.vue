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
          <el-form-item label="院系简介" prop="facultyDescription">
            <el-input v-model="facultyForm.facultyDescription" placeholder="请输入院系简介" type="textarea" :rows="5" maxlength="65535"></el-input>
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

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import facultyApi from '@/api/facultyApi'
import type {Faculty} from "@/types/resp/faculty";
import type {Id} from "@/types/id"

const facultyForm = reactive<Partial<Faculty>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeFacultyViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initFacultyById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initFacultyById = async (id: number) => {
  const resp = await facultyApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(facultyForm, resp.data)
  }
}
const onBack = () => {
  emit('closeFacultyViewEvent')
}
</script>

<style lang="scss">
</style>
