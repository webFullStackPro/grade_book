<template>
  <el-menu class="aside-menu"
           router
           :collapse="isCollapse"
           :default-active="currentHash"
           @select="handleSelect"
           :unique-opened="true">
    <el-menu-item :index="0">
      <el-icon v-if="!isCollapse"><Fold/></el-icon><el-icon v-if="isCollapse"><Expand /></el-icon>
      <span slot="title">收起</span>
    </el-menu-item>
    <template v-if="type === 1">
      <el-menu-item v-for="item in adminMenuItems" :key="item.index" :index="item.index">
        <el-icon><component :is="item.icon"></component></el-icon>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </template>
    <template v-if="type === 2">
      <el-menu-item v-for="item in teacherMenuItems" :key="item.index" :index="item.index">
        <el-icon><component :is="item.icon"></component></el-icon>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </template>
    <template v-if="type === 3">
      <el-menu-item v-for="item in studentMenuItems" :key="item.index" :index="item.index">
        <el-icon><component :is="item.icon"></component></el-icon>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import { getTypeAsNumber } from '@/composables/getTypeAsNumberFromSessionStorage';
import {
  Avatar,
  Expand,
  Document,
  Fold,
  Grid,
  Histogram,
  Key,
  OfficeBuilding,
  Reading,
  School,
  Tickets,
  User,
  UserFilled, PieChart
} from '@element-plus/icons-vue';

const route = useRoute()
const isCollapse = ref(false);
const currentHash = computed(() => {
  return route.fullPath
});

const handleSelect = (key: string) => {
  console.log('key', key)
  if (!key) {
    isCollapse.value = !isCollapse.value
  }
}

const type = getTypeAsNumber()

const adminMenuItems = [
  { index: '/AdminList', icon: UserFilled, title: '管理员' },
  { index: '/UniversityList', icon: School, title: '学校信息' },
  { index: '/FacultyList', icon: OfficeBuilding, title: '院系信息' },
  { index: '/MajorList', icon: Reading, title: '专业信息' },
  { index: '/TeacherList', icon: Avatar, title: '教师信息' },
  { index: '/StudentList', icon: User, title: '学生信息' },
  { index: '/CourseList', icon: Grid, title: '课程信息' },
  { index: '/AttendanceList', icon: Histogram, title: '考勤信息' },
  { index: '/GradeList', icon: Document, title: '成绩信息' },
  { index: '/ChartList', icon: PieChart, title: '数据统计' }
]

const teacherMenuItems = [
  { index: '/TeacherPersonalInfo', icon: Avatar, title: '教师个人信息' },
  { index: '/CourseListOfTeacher', icon: Grid, title: '我的课程' },
  { index: '/GradeListOfTeacher', icon: Document, title: '学生成绩' }
]

const studentMenuItems = [
  { index: '/StudentPersonalInfo', icon: Avatar, title: '学生个人信息' },
  { index: '/CourseListOfStudent', icon: Grid, title: '我的课程' },
  { index: '/AttendanceListOfStudent', icon: Histogram, title: '我的考勤' },
  { index: '/GradeListOfStudent', icon: Document, title: '我的成绩' }
]

</script>

<style lang="scss" scoped>
.aside-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
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
  //background: adjust-color($primary-color, $lightness: -5%);
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
