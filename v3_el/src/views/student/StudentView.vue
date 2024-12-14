<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="studentForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="学号">
            <el-input v-model="studentForm.studentNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="studentForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="密码">
            <el-input v-model="studentForm.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="性别">
            <el-select v-model="studentForm.gender" placeholder="请选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="出生日期">
            <el-input v-model="studentForm.birthDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="专业名称">
            <el-input v-model="studentForm.majorName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="年级">
            <el-input v-model="studentForm.grade"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="studentForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮箱">
            <el-input v-model="studentForm.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="省/市/区">
            <el-cascader
              v-model="provinceCityArea"
              :options="provinceCityAreaOptions"
              :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="家庭地址">
            <el-input v-model="studentForm.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="入学日期">
            <el-input v-model="studentForm.enrollmentDate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="毕业日期">
            <el-input v-model="studentForm.graduationDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="studentForm.createTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="studentForm.modifyTime"></el-input>
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
import studentApi from '@/api/studentApi'
import type {Student} from "@/types/resp/student";
import type {Id} from "@/types/id"
import areas from "@/locales/area.json";

const studentForm = reactive<Partial<Student>>({});
const props = defineProps<Id>()
const provinceCityArea = ref<string[]>([])
const provinceCityAreaOptions = areas.provinces
const emit = defineEmits<{
  (e: 'closeStudentViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initStudentById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initStudentById = async (id: number) => {
  const resp = await studentApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(studentForm, resp.data)
    provinceCityArea.value = []
    if (studentForm.province) {
      provinceCityArea.value.push(studentForm.province)
    }
    if (studentForm.city) {
      provinceCityArea.value.push(studentForm.city)
    }
    if (studentForm.area) {
      provinceCityArea.value.push(studentForm.area)
    }
  }
}
const onBack = () => {
  emit('closeStudentViewEvent')
}
</script>

<style lang="scss">
</style>
