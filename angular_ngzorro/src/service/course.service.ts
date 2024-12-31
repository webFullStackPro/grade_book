import {Injectable} from '@angular/core';
import {Course} from '../types/resp/Course';
import {CourseForm} from '../types/req/CourseForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {CourseQueryForm} from '../types/req/CourseQueryForm';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courses: Course[] = [
    {"id": 1, "facultyId": 2, "facultyName": "计算机科学学院", "teacherId": 3, "teacherName": "张老师", "code": "CS101", "name": "计算机编程基础", "credit": 3, "courseDescription": "本课程主要介绍计算机编程的基础知识，包括编程语言的语法、数据结构等，帮助学生打下扎实的编程基础。", "createTime": "2024-09-01 10:00:00", "modifyTime": "2024-10-15 15:30:00"},
    {"id": 2, "facultyId": 2, "facultyName": "计算机科学学院", "teacherId": 4, "teacherName": "李老师", "code": "CS202", "name": "数据结构与算法", "credit": 4, "courseDescription": "深入讲解常见的数据结构，如链表、树、图等，以及相关的算法设计与分析方法，培养学生解决复杂问题的能力。", "createTime": "2024-09-05 14:00:00", "modifyTime": "2024-11-05 09:45:00"},
    {"id": 3, "facultyId": 4, "facultyName": "经济管理学院", "teacherId": 3, "teacherName": "王老师", "code": "EM301", "name": "微观经济学", "credit": 3, "courseDescription": "系统学习微观经济主体的行为和决策，包括消费者理论、生产者理论等，为理解市场经济运行机制奠定基础。", "createTime": "2024-08-20 09:30:00", "modifyTime": "2024-12-01 16:20:00"},
    {"id": 4, "facultyId": 1, "facultyName": "文学院", "teacherId": 1, "teacherName": "赵老师", "code": "LA105", "name": "中国古代文学", "credit": 2, "courseDescription": "通过研读经典的古代文学作品，探讨不同时期的文学思潮、作家风格等，领略中国古代文学的魅力与深厚底蕴。", "createTime": "2024-09-10 11:20:00", "modifyTime": "2024-10-25 13:15:00"},
    {"id": 5, "facultyId": 4, "facultyName": "理学院", "teacherId": 2, "teacherName": "孙老师", "code": "SC203", "name": "高等数学", "credit": 4, "courseDescription": "讲授高等数学中的微积分、级数等重要内容，提升学生的数学思维和运算能力，为后续的理工科学习提供数学基础。", "createTime": "2024-08-15 13:45:00", "modifyTime": "2024-11-18 17:00:00"},
    {"id": 6, "facultyId": 1, "facultyName": "工程学院", "teacherId": 1, "teacherName": "陈老师", "code": "EN102", "name": "工程制图", "credit": 2, "courseDescription": "教授工程制图的基本原理和方法，培养学生绘制和阅读工程图纸的能力，是工程专业的重要基础课程。", "createTime": "2024-09-01 10:00:00", "modifyTime": "2024-10-15 15:30:00"}
  ]
  constructor() {
  }

  save (courseForm: CourseForm): Observable<Result<void>> {
    console.log('courseApi save params', courseForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (courseQueryForm: CourseQueryForm): Observable<Result<Page<Course>>> {
    console.log('courseApi find params', courseQueryForm)
    return MockApi.queryPageSuccessfully(this.courses).pipe(
      map((response: Response<Result<Page<Course>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Course>> {
    console.log('courseApi findById id', id)
    let target = {}
    for (const a of this.courses) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Course>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('courseApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
