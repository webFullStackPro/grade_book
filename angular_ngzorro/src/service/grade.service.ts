import {Injectable} from '@angular/core';
import {Grade} from '../types/resp/Grade';
import {GradeForm} from '../types/req/GradeForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {GradeQueryForm} from '../types/req/GradeQueryForm';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  grades: Grade[] = [
    {"id": 1, "courseId": 3, "courseName": "高等数学", "studentId": 2, "studentNumber": "20240002", "grade": 85, "createTime": "2024-06-30 14:30:00", "modifyTime": "2024-07-05 09:00:00"},
    {"id": 2, "courseId": 3, "courseName": "高等数学", "studentId": 1, "studentNumber": "20240001", "grade": 78, "createTime": "2024-06-30 15:00:00", "modifyTime": "2024-07-01 10:15:00"},
    {"id": 3, "courseId": 3, "courseName": "高等数学", "studentId": 4, "studentNumber": "20240004", "grade": 92, "createTime": "2024-06-30 14:45:00", "modifyTime": "2024-07-03 11:30:00"},
    {"id": 4, "courseId": 1, "courseName": "计算机编程基础", "studentId": 3, "studentNumber": "20240003", "grade": 82, "createTime": "2024-07-10 10:20:00", "modifyTime": "2024-07-12 15:45:00"},
    {"id": 5, "courseId": 2, "courseName": "数据结构与算法", "studentId": 4, "studentNumber": "20240004", "grade": 95, "createTime": "2024-07-15 09:40:00", "modifyTime": "2024-07-18 14:20:00"}
  ]
  constructor() {
  }

  save (gradeForm: GradeForm): Observable<Result<void>> {
    console.log('gradeApi save params', gradeForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (gradeQueryForm: GradeQueryForm): Observable<Result<Page<Grade>>> {
    console.log('gradeApi find params', gradeQueryForm)
    return MockApi.queryPageSuccessfully(this.grades).pipe(
      map((response: Response<Result<Page<Grade>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Grade>> {
    console.log('gradeApi findById id', id)
    let target = {}
    for (const a of this.grades) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Grade>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('gradeApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
