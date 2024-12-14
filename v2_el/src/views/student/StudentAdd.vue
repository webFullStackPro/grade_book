<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="studentForm" :label-width="formLabelWidth" ref="refStudentForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="学号" prop="studentNumber">
            <el-input v-model="studentForm.studentNumber" placeholder="请输入学号" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="studentForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="密码" prop="password">
            <el-input v-model="studentForm.password" placeholder="请输入密码" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="studentForm.gender" placeholder="请选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="出生日期" prop="birthDate">
            <el-date-picker
                v-model="studentForm.birthDate" type="date" placeholder="出生日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="专业名称" prop="majorName">
            <el-input v-model="studentForm.majorName" placeholder="请选择专业名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findMajor"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="年级" prop="grade">
            <el-input-number v-model="studentForm.grade" :min="2000" :max="2100"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="studentForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="studentForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="省/市/区">
            <el-cascader
                v-model="provinceCityArea"
                :options="provinceCityAreaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
                @change="handleChange"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="家庭地址" prop="address">
            <el-input v-model="studentForm.address" placeholder="请输入家庭地址" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="入学日期" prop="enrollmentDate">
            <el-date-picker
                v-model="studentForm.enrollmentDate" type="date" placeholder="入学日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="毕业日期" prop="graduationDate">
            <el-date-picker
                v-model="studentForm.graduationDate" type="date" placeholder="毕业日期" value-format="yyyy-MM-dd">
            </el-date-picker>
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
    <el-dialog :visible.sync="majorSelectorVisible" v-if="majorSelectorVisible" title="专业信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <major-selector @major-selected-event="handleMajorSelectedEvent">
      </major-selector>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from '@/api/studentApi'
import MajorSelector from "@/views/major/MajorSelector.vue";
import areas from "@/locales/area.json";
export default {
  name: 'StudentAdd',
  components: {MajorSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      studentForm: {
        studentNumber: '',
        name: '',
        password: '',
        gender: '',
        birthDate: '',
        majorId: '',
        majorName: '',
        grade: '',
        contactPhone: '',
        email: '',
        province: '',
        city: '',
        area: '',
        address: '',
        enrollmentDate: '',
        graduationDate: ''
      },
      rules: {
        studentNumber: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        birthDate: [
          { required: true, message: '请输入出生日期', trigger: 'blur' }
        ],
        majorName: [
          { required: true, message: '请输入专业名称', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
      },
      majorSelectorVisible: false,
      provinceCityArea: [],
      provinceCityAreaOptions: areas.provinces
    }
  },
  created () {
    if (this.id) {
      studentApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.studentForm = resp.data
            this.provinceCityArea = []
            if (this.studentForm.province) {
              this.provinceCityArea.push(this.studentForm.province)
            }
            if (this.studentForm.city) {
              this.provinceCityArea.push(this.studentForm.city)
            }
            if (this.studentForm.area) {
              this.provinceCityArea.push(this.studentForm.area)
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
      this.studentForm = {
        studentNumber: '',
        name: '',
        password: '',
        gender: '',
        birthDate: '',
        majorId: '',
        majorName: '',
        grade: '',
        contactPhone: '',
        email: '',
        province: '',
        city: '',
        area: '',
        address: '',
        enrollmentDate: '',
        graduationDate: ''
      }
      this.provinceCityArea = []
      this.$emit('reset-student-add-event')
    },
    onSave () {
      this.$refs.refStudentForm.validate((valid) => {
        if (valid) {
          studentApi.save(this.studentForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-student-add-event', {search: true})
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
    findMajor () {
      this.majorSelectorVisible = true
    },
    handleMajorSelectedEvent (selectedMajor) {
      this.majorSelectorVisible = false
      if (selectedMajor && 'majorId' in selectedMajor && this.studentForm.majorId !== selectedMajor['majorId']) {
        this.studentForm.majorId = selectedMajor['majorId']
        this.studentForm.majorName = selectedMajor['majorName']
      }
    },
    handleChange(value) {
      if (value && value.length) {
        this.studentForm.province = value[0]
      }
      if (value && value.length > 1) {
        this.studentForm.city = value[1]
      }
      if (value && value.length > 2) {
        this.studentForm.area = value[1]
      }
    },
    onBack () {
      this.$emit('close-student-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>