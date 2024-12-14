<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="universityForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="学校名称">
            <el-input v-model="universityForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="成立日期">
            <el-input v-model="universityForm.establishmentDate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="universityForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱">
            <el-input v-model="universityForm.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="省/市/区">
            <el-cascader
              v-model="provinceCityArea"
              :options="provinceCityAreaOptions"
              :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"/>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="地址">
            <el-input v-model="universityForm.location"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="学校简介" prop="universityDescription">
            <el-input v-model="universityForm.universityDescription" placeholder="请输入学校简介" type="textarea" :rows="5" maxlength="65535"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="universityForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="universityForm.modifyTime"></el-input>
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
import universityApi from '@/api/universityApi'
import type {University} from "@/types/resp/university";
import type {Id} from "@/types/id"
import areas from "@/locales/area.json";

const universityForm = reactive<Partial<University>>({});
const props = defineProps<Id>()
const provinceCityArea = ref<string[]>([])
const provinceCityAreaOptions = areas.provinces
const emit = defineEmits<{
  (e: 'closeUniversityViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initUniversityById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initUniversityById = async (id: number) => {
  const resp = await universityApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(universityForm, resp.data)
    provinceCityArea.value = []
    if (universityForm.province) {
      provinceCityArea.value.push(universityForm.province)
    }
    if (universityForm.city) {
      provinceCityArea.value.push(universityForm.city)
    }
    if (universityForm.area) {
      provinceCityArea.value.push(universityForm.area)
    }
  }
}
const onBack = () => {
  emit('closeUniversityViewEvent')
}
</script>

<style lang="scss">
</style>
