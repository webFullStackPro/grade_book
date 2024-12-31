import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';
import {AdminListComponent} from './admin/admin-list.component';
import {UniversityListComponent} from './university/university-list.component';
import {FacultyListComponent} from './faculty/faculty-list.component';
import {MajorListComponent} from './major/major-list.component';
import {TeacherListComponent} from './teacher/teacher-list.component';
import {StudentListComponent} from './student/student-list.component';
import {CourseListComponent} from './course/course-list.component';
import {AttendanceListComponent} from './attendance/attendance-list.component';
import {GradeListComponent} from './grade/grade-list.component';
import {ChartListComponent} from './chart/chart-list.component';
import {TeacherPersonalInfoComponent} from './teacher/teacher-personal-info.component';
import {StudentPersonalInfoComponent} from './student/student-personal-info.component';
import {TeacherRegisterComponent} from './teacher/teacher-register.component';
import {StudentRegisterComponent} from './student/student-register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'TeacherRegister', component: TeacherRegisterComponent },
  { path: 'StudentRegister', component: StudentRegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/Home', pathMatch: 'full' },
      { path: 'Home', component: HomeComponent },
      { path: 'AdminList', component: AdminListComponent },
      { path: 'UniversityList', component: UniversityListComponent },
      { path: 'FacultyList', component: FacultyListComponent },
      { path: 'MajorList', component: MajorListComponent },
      { path: 'TeacherList', component: TeacherListComponent },
      { path: 'StudentList', component: StudentListComponent },
      { path: 'CourseList', component: CourseListComponent },
      { path: 'AttendanceList', component: AttendanceListComponent },
      { path: 'GradeList', component: GradeListComponent },
      { path: 'ChartList', component: ChartListComponent },
      { path: 'TeacherPersonalInfo', component: TeacherPersonalInfoComponent },
      { path: 'CourseListOfTeacher', component: CourseListComponent },
      { path: 'GradeListOfTeacher', component: GradeListComponent },
      { path: 'StudentPersonalInfo', component: StudentPersonalInfoComponent },
      { path: 'CourseListOfStudent', component: CourseListComponent },
      { path: 'AttendanceListOfStudent', component: AttendanceListComponent },
      { path: 'GradeListOfStudent', component: GradeListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
