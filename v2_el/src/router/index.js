import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/components/Layout.vue'
import Aside from '../views/components/Aside.vue'
import Header from '../views/components/Header.vue'
import Footer from '../views/components/Footer.vue'
import Main from '../views/components/Main.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import StudentRegister from '../views/StudentRegister.vue'
import TeacherRegister from '../views/TeacherRegister.vue'
import AdminList from '../views/admin/AdminList.vue'
import UniversityList from '../views/university/UniversityList.vue'
import FacultyList from '../views/faculty/FacultyList.vue'
import MajorList from '../views/major/MajorList.vue'
import TeacherList from '@/views/teacher/TeacherList.vue'
import TeacherPersonalInfo from '@/views/teacher/TeacherPersonalInfo.vue'
import StudentList from '@/views/student/StudentList.vue'
import StudentPersonalInfo from '@/views/student/StudentPersonalInfo.vue'
import CourseList from '@/views/course/CourseList.vue'
import GradeList from '@/views/grade/GradeList.vue'
import AttendanceList from "@/views/attendance/AttendanceList.vue";
import ChartList from "@/views/chart/ChartList.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        components: {
          default: Main,
          aside: Aside,
          header: Header,
          footer: Footer
        },
        children: [
          {
            path: '/Home',
            name: 'Home',
            component: Home
          },
          {
            path: '/AdminList',
            name: 'AdminList',
            component: AdminList
          },
          {
            path: '/UniversityList',
            name: 'UniversityList',
            component: UniversityList
          },
          {
            path: '/FacultyList',
            name: 'FacultyList',
            component: FacultyList
          },
          {
            path: '/MajorList',
            name: 'MajorList',
            component: MajorList
          },
          {
            path: '/TeacherList',
            name: 'TeacherList',
            component: TeacherList
          },
          {
            path: '/StudentList',
            name: 'StudentList',
            component: StudentList
          },
          {
            path: '/CourseList',
            name: 'CourseList',
            component: CourseList
          },
          {
            path: '/AttendanceList',
            name: 'AttendanceList',
            component: AttendanceList
          },
          {
            path: '/GradeList',
            name: 'GradeList',
            component: GradeList
          },
          {
            path: '/TeacherPersonalInfo',
            name: 'TeacherPersonalInfo',
            component: TeacherPersonalInfo
          },
          {
            path: '/CourseListOfTeacher',
            name: 'CourseListOfTeacher',
            component: CourseList
          },
          {
            path: '/GradeListOfTeacher',
            name: 'GradeListOfTeacher',
            component: GradeList
          },
          {
            path: '/StudentPersonalInfo',
            name: 'StudentPersonalInfo',
            component: StudentPersonalInfo
          },
          {
            path: '/CourseListOfStudent',
            name: 'CourseListOfStudent',
            component: CourseList
          },
          {
            path: '/AttendanceListOfStudent',
            name: 'AttendanceListOfStudent',
            component: AttendanceList
          },
          {
            path: '/GradeListOfStudent',
            name: 'GradeListOfStudent',
            component: GradeList
          },
          {
            path: '/ChartList',
            name: 'ChartList',
            component: ChartList
          }
        ]
      }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/StudentRegister',
    name: 'StudentRegister',
    component: StudentRegister
  },
  {
    path: '/TeacherRegister',
    name: 'TeacherRegister',
    component: TeacherRegister
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'TeacherRegister' && to.name !== 'StudentRegister' && !sessionStorage.getItem('loginToken')) {
    next('/Login')
  } else {
    next()
  }
})

export default router
