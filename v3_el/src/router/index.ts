import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/Layout.vue'
import {Avatar, Document, Grid, Histogram} from "@element-plus/icons-vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [{
        path: "/",
        component: () => import("@/views/Home.vue"),
        name: "Home"
      },{
        path: "/AdminList",
        component: () => import("@/views/admin/AdminList.vue"),
        name: "AdminList"
      },{
        path: "/UniversityList",
        component: () => import("@/views/university/UniversityList.vue"),
        name: "UniversityList"
      },{
        path: "/FacultyList",
        component: () => import("@/views/faculty/FacultyList.vue"),
        name: "FacultyList"
      },{
        path: "/MajorList",
        component: () => import("@/views/major/MajorList.vue"),
        name: "MajorList"
      },{
        path: "/TeacherList",
        component: () => import("@/views/teacher/TeacherList.vue"),
        name: "TeacherList"
      },{
        path: "/StudentList",
        component: () => import("@/views/student/StudentList.vue"),
        name: "StudentList"
      },{
        path: "/CourseList",
        component: () => import("@/views/course/CourseList.vue"),
        name: "CourseList"
      },{
        path: "/AttendanceList",
        component: () => import("@/views/attendance/AttendanceList.vue"),
        name: "AttendanceList"
      },{
        path: "/GradeList",
        component: () => import("@/views/grade/GradeList.vue"),
        name: "GradeList"
      },{
        path: "/ChartList",
        component: () => import("@/views/chart/ChartList.vue"),
        name: "ChartList"
      },{
        path: "/TeacherPersonalInfo",
        component: () => import("@/views/teacher/TeacherPersonalInfo.vue"),
        name: "TeacherPersonalInfo"
      },{
        path: "/CourseListOfTeacher",
        component: () => import("@/views/course/CourseList.vue"),
        name: "CourseListOfTeacher"
      },{
        path: "/GradeListOfTeacher",
        component: () => import("@/views/grade/GradeList.vue"),
        name: "GradeListOfTeacher"
      },{
        path: "/StudentPersonalInfo",
        component: () => import("@/views/student/StudentPersonalInfo.vue"),
        name: "StudentPersonalInfo"
      },{
        path: "/CourseListOfStudent",
        component: () => import("@/views/course/CourseList.vue"),
        name: "CourseListOfStudent"
      },{
        path: "/AttendanceListOfStudent",
        component: () => import("@/views/attendance/AttendanceList.vue"),
        name: "AttendanceListOfStudent"
      },{
        path: "/GradeListOfStudent",
        component: () => import("@/views/grade/GradeList.vue"),
        name: "GradeListOfStudent"
      }]
    },{
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },{
      path: '/StudentRegister',
      name: 'StudentRegister',
      component: () => import('@/views/StudentRegister.vue'),
    },{
      path: '/TeacherRegister',
      name: 'TeacherRegister',
      component: () => import('@/views/TeacherRegister.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  const loginToken = sessionStorage.getItem('loginToken');

  if (to.name !== 'Login' && to.name !== 'TeacherRegister' && to.name !== 'StudentRegister' && !loginToken) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
