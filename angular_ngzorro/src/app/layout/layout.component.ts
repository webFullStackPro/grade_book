import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SharedModule} from '../shared.module';
import {AuthService} from '../../service/auth.service';
import {HeaderComponent} from './header/header.component';
import {getTypeAsNumber} from '../../util/getTypeAsNumberFromSessionStorage';

@Component({
  selector: 'app-layout',
  imports: [
    SharedModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.less'
})
export class LayoutComponent implements OnInit {
  isCollapsed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  menuItems = [
    { label: '主页', icon: 'home', link: '/Home' },
    { label: '管理员', icon: 'user', link: '/AdminList' },
    { label: '学校信息', icon: 'bank', link: '/UniversityList' },
    { label: '院系信息', icon: 'table', link: '/FacultyList' },
    { label: '专业信息', icon: 'book', link: '/MajorList' },
    { label: '教师信息', icon: 'solution', link: '/TeacherList' },
    { label: '学生信息', icon: 'team', link: '/StudentList' },
    { label: '课程信息', icon: 'customer-service', link: '/CourseList' },
    { label: '考勤信息', icon: 'bell', link: '/AttendanceList' },
    { label: '成绩信息', icon: 'audit', link: '/GradeList' },
    { label: '数据统计', icon: 'pie-chart', link: '/ChartList' }
  ];

  ngOnInit(): void {
    const type = getTypeAsNumber()
    if (type === 2) {
      this.menuItems = [
        { label: '主页', icon: 'home', link: '/Home' },
        { label: '教师个人信息', icon: 'solution', link: '/TeacherPersonalInfo' },
        { label: '课程信息', icon: 'customer-service', link: '/CourseListOfTeacher' },
        { label: '成绩信息', icon: 'audit', link: '/GradeListOfTeacher' },
      ]
    }
    if (type === 3) {
      this.menuItems = [
        { label: '主页', icon: 'home', link: '/Home' },
        { label: '学生个人信息', icon: 'solution', link: '/StudentPersonalInfo' },
        { label: '课程信息', icon: 'customer-service', link: '/CourseListOfStudent' },
        { label: '我的考勤', icon: 'bell', link: '/AttendanceListOfStudent' },
        { label: '成绩信息', icon: 'audit', link: '/GradeListOfStudent' },
      ]
    }
  }

  menuClick(item: any) {
    this.router.navigate([item.key]);
  }

  logout() {
    this.authService.logout();
    sessionStorage.removeItem('loginToken')
    sessionStorage.removeItem('uid')
    sessionStorage.removeItem('username')
    this.router.navigate(['/login']);
  }

}
