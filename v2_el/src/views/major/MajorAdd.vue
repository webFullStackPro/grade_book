<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="majorForm" :label-width="formLabelWidth" ref="refMajorForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系名称" prop="facultyName">
            <el-input v-model="majorForm.facultyName" placeholder="请选择院系名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findFaculty"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="专业名称" prop="name">
            <el-input v-model="majorForm.name" placeholder="请输入专业名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="学位类型" prop="degreeType">
            <el-select v-model="majorForm.degreeType" placeholder="请选择学位类型">
              <el-option label="学士" :value="1"></el-option>
              <el-option label="硕士" :value="2"></el-option>
              <el-option label="博士" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学制(年)" prop="duration">
            <el-input-number v-model="majorForm.duration" :min="1" :max="10"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="majorForm.contactPhone" placeholder="请输入联系电话" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="majorForm.email" placeholder="请输入邮箱" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="办公地点" prop="officeLocation">
            <el-input v-model="majorForm.officeLocation" placeholder="请输入办公地点" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="专业简介" prop="majorDescription">
            <el-input v-model="majorForm.majorDescription" placeholder="请输入专业简介" type="textarea" :rows="5" maxlength="65535"></el-input>
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
    <el-dialog :visible.sync="facultySelectorVisible" v-if="facultySelectorVisible" title="院系信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <faculty-selector @faculty-selected-event="handleFacultySelectedEvent">
      </faculty-selector>
    </el-dialog>
  </div>
</template>

<script>
import majorApi from '@/api/majorApi'
import FacultySelector from "@/views/faculty/FacultySelector.vue";
export default {
  name: 'MajorAdd',
  components: {FacultySelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      majorForm: {
        facultyId: '',
        facultyName: '',
        name: '',
        degreeType: '',
        duration: '',
        contactPhone: '',
        email: '',
        officeLocation: '',
        majorDescription: ''
      },
      rules: {
        facultyName: [
          { required: true, message: '请输入院系名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入专业名称', trigger: 'blur' }
        ],
        degreeType: [
          { required: true, message: '请输入学位类型', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请输入学制(年)', trigger: 'blur' }
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
      facultySelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      majorApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.majorForm = resp.data
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
      this.majorForm = {
        facultyId: '',
        facultyName: '',
        name: '',
        degreeType: '',
        duration: '',
        contactPhone: '',
        email: '',
        officeLocation: '',
        majorDescription: ''
      }
      this.$emit('reset-major-add-event')
    },
    onSave () {
      this.$refs.refMajorForm.validate((valid) => {
        if (valid) {
          majorApi.save(this.majorForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-major-add-event', {search: true})
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
    findFaculty () {
      this.facultySelectorVisible = true
    },
    handleFacultySelectedEvent (selectedFaculty) {
      this.facultySelectorVisible = false
      if (selectedFaculty && 'facultyId' in selectedFaculty && this.majorForm.facultyId !== selectedFaculty['facultyId']) {
        this.majorForm.facultyId = selectedFaculty['facultyId']
        this.majorForm.facultyName = selectedFaculty['facultyName']
      }
    },
    onBack () {
      this.$emit('close-major-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>