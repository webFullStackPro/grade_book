<template>
  <el-menu class="aside-menu"
           router
           :collapse="isCollapse"
           :default-openeds="defaultOpeneds"
           :default-active="currentHash"
           :unique-opened="true"
           @select="handleSelect">
    <el-menu-item>
      <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
      <span slot="title">收起</span>
    </el-menu-item>
    <template v-if="type === 1">
      <el-menu-item v-for="item in adminMenuItems" :key="item.index" :index="item.index">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </template>
    <template v-if="type === 2">
    <el-menu-item v-for="item in teacherMenuItems" :key="item.index" :index="item.index">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.title }}</span>
    </el-menu-item>
    </template>
    <template v-if="type === 3">
    <el-menu-item v-for="item in studentMenuItems" :key="item.index" :index="item.index">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.title }}</span>
    </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Aside',
  data () {
    return {
      isCollapse: false,
      navbars: [],
      defaultOpeneds: [],
      type: 0,
      adminMenuItems: [
        { index: '/Home', icon: 'el-icon-house', title: '主页' },
        { index: '/AdminList', icon: 'el-icon-user-solid', title: '管理员' },
        { index: '/UniversityList', icon: 'el-icon-school', title: '学校信息' },
        { index: '/FacultyList', icon: 'el-icon-office-building', title: '院系信息' },
        { index: '/MajorList', icon: 'el-icon-s-check', title: '专业信息' },
        { index: '/TeacherList', icon: 'el-icon-s-custom', title: '教师信息' },
        { index: '/StudentList', icon: 'el-icon-user', title: '学生信息' },
        { index: '/CourseList', icon: 'el-icon-s-grid', title: '课程信息' },
        { index: '/AttendanceList', icon: 'el-icon-s-data', title: '考勤信息' },
        { index: '/GradeList', icon: 'el-icon-document', title: '成绩信息' },
        { index: '/ChartList', icon: 'el-icon-pie-chart', title: '数据统计' }
      ],
      teacherMenuItems: [
        { index: '/Home', icon: 'el-icon-house', title: '主页' },
        { index: '/TeacherPersonalInfo', icon: 'el-icon-s-custom', title: '教师个人信息' },
        { index: '/CourseListOfTeacher', icon: 'el-icon-s-grid', title: '我的课程' },
        { index: '/GradeListOfTeacher', icon: 'el-icon-document', title: '学生成绩' }
      ],
      studentMenuItems: [
        { index: '/Home', icon: 'el-icon-house', title: '主页' },
        { index: '/StudentPersonalInfo', icon: 'el-icon-s-custom', title: '学生个人信息' },
        { index: '/CourseListOfStudent', icon: 'el-icon-s-grid', title: '我的课程' },
        { index: '/AttendanceListOfStudent', icon: 'el-icon-s-data', title: '我的考勤' },
        { index: '/GradeListOfStudent', icon: 'el-icon-document', title: '我的成绩' }
      ]
    }
  },
  created () {
  },
  mounted () {
    const type = sessionStorage.getItem('type')
    if (type) {
      this.type = Number(type)
    }
  },
  methods: {
    handleSelect(key) {
      if (!key) {
        this.isCollapse = !this.isCollapse
      }
      console.log('key', key)
    },
  },
  computed: {
    currentHash () {
      return this.$router.currentRoute.fullPath
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/var";

.aside-menu {
  height: 100%;
  width: 250px;
}

.brand {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  margin-right: -1px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background: darken($primary-color, 5);
  box-shadow: 0 1px 1px 0 $box-shadow-base;
  white-space: nowrap;

  .platform-name {
    cursor: pointer;
    height: 60px;
    line-height: 60px;
  }
}

.toggle {
  display: inline-block;
  width: 20px;
  cursor: pointer;

  @at-root #{&}__minus {
    display: block;
    width: 20px;
    height: 2px;
    background: #fff;
    margin-bottom: 5px;
  }
}
</style>
