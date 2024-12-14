<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="facultyForm" :label-width="formLabelWidth" ref="refFacultyForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="学校名称" prop="universityName">
            <el-input v-model="facultyForm.universityName" placeholder="请选择学校名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findUniversity"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="院系名称" prop="name">
            <el-input v-model="facultyForm.name" placeholder="请输入院系名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="成立日期" prop="establishmentDate">
            <el-date-picker
                v-model="facultyForm.establishmentDate" type="date" placeholder="成立日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="facultyForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="facultyForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="办公地点" prop="officeLocation">
            <el-input v-model="facultyForm.officeLocation" placeholder="请输入办公地点" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系网址" prop="website">
            <el-input v-model="facultyForm.website" placeholder="请输入院系网址" maxlength="255"></el-input>
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
    <el-dialog :visible.sync="universitySelectorVisible" v-if="universitySelectorVisible" title="学校信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <university-selector @university-selected-event="handleUniversitySelectedEvent">
      </university-selector>
    </el-dialog>
  </div>
</template>

<script>
import facultyApi from '@/api/facultyApi'
import UniversitySelector from "@/views/university/UniversitySelector.vue";
export default {
  name: 'FacultyAdd',
  components: {UniversitySelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      facultyForm: {
        universityId: '',
        universityName: '',
        name: '',
        establishmentDate: '',
        contactPhone: '',
        email: '',
        officeLocation: '',
        website: '',
        facultyDescription: ''
      },
      rules: {
        universityName: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入院系名称', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        officeLocation: [
          { required: true, message: '请输入办公地点', trigger: 'blur' }
        ],
      },
      universitySelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      facultyApi.findById(Number(this.id))
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
    onReset () {
      this.facultyForm = {
        universityId: '',
        universityName: '',
        name: '',
        establishmentDate: '',
        contactPhone: '',
        email: '',
        officeLocation: '',
        website: '',
        facultyDescription: ''
      }
      this.$emit('reset-faculty-add-event')
    },
    onSave () {
      this.$refs.refFacultyForm.validate((valid) => {
        if (valid) {
          facultyApi.save(this.facultyForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-faculty-add-event', {search: true})
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
    findUniversity () {
      this.universitySelectorVisible = true
    },
    handleUniversitySelectedEvent (selectedUniversity) {
      this.universitySelectorVisible = false
      if (selectedUniversity && 'universityId' in selectedUniversity && this.facultyForm.universityId !== selectedUniversity['universityId']) {
        this.facultyForm.universityId = selectedUniversity['universityId']
        this.facultyForm.universityName = selectedUniversity['universityName']
      }
    },
    onBack () {
      this.$emit('close-faculty-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>