<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="universityForm" :label-width="formLabelWidth" ref="refUniversityForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="学校名称" prop="name">
            <el-input v-model="universityForm.name" placeholder="请输入学校名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="成立日期" prop="establishmentDate">
            <el-date-picker
                v-model="universityForm.establishmentDate" type="date" placeholder="成立日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="universityForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="universityForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="省/市/区">
            <el-cascader
                v-model="provinceCityArea"
                :options="provinceCityAreaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
                @change="handleChange"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="地址" prop="location">
            <el-input v-model="universityForm.location" placeholder="请输入地址" maxlength="255"></el-input>
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
import universityApi from '@/api/universityApi'
import areas from '@/locales/area.json';
export default {
  name: 'UniversityAdd',
  components: {},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      universityForm: {
        name: '',
        establishmentDate: '',
        contactPhone: '',
        email: '',
        province: '',
        city: '',
        area: '',
        location: '',
        universityDescription: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
      },
      provinceCityArea: [],
      provinceCityAreaOptions: areas.provinces
    }
  },
  created () {
    if (this.id) {
      universityApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.universityForm = resp.data
            this.provinceCityArea = []
            if (this.universityForm.province) {
              this.provinceCityArea.push(this.universityForm.province)
            }
            if (this.universityForm.city) {
              this.provinceCityArea.push(this.universityForm.city)
            }
            if (this.universityForm.area) {
              this.provinceCityArea.push(this.universityForm.area)
            }
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
      this.universityForm = {
        name: '',
        establishmentDate: '',
        contactPhone: '',
        email: '',
        province: '',
        city: '',
        area: '',
        location: '',
        universityDescription: ''
      }
      this.provinceCityArea = []
      this.$emit('reset-university-add-event')
    },
    onSave () {
      this.$refs.refUniversityForm.validate((valid) => {
        if (valid) {
          universityApi.save(this.universityForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-university-add-event', {search: true})
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
    handleChange(value) {
      if (value && value.length) {
        this.universityForm.province = value[0]
      }
      if (value && value.length > 1) {
        this.universityForm.city = value[1]
      }
      if (value && value.length > 2) {
        this.universityForm.area = value[1]
      }
    },
    onBack () {
      this.$emit('close-university-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>