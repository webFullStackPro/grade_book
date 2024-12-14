import mockApi from "@/api/mockApi";
import type {GradeForm} from '@/types/req/gradeForm'
import type {GradeQueryForm} from '@/types/req/gradeQueryForm'
import type {Grade} from '@/types/resp/grade'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class gradeApi {
  static grades: Grade[] = [
    {"id": 1, "courseId": 3, "courseName": "高等数学", "studentId": 2, "studentNumber": "20240002", "grade": 85, "createTime": "2024-06-30 14:30:00", "modifyTime": "2024-07-05 09:00:00"},
    {"id": 2, "courseId": 3, "courseName": "高等数学", "studentId": 1, "studentNumber": "20240001", "grade": 78, "createTime": "2024-06-30 15:00:00", "modifyTime": "2024-07-01 10:15:00"},
    {"id": 3, "courseId": 3, "courseName": "高等数学", "studentId": 4, "studentNumber": "20240004", "grade": 92, "createTime": "2024-06-30 14:45:00", "modifyTime": "2024-07-03 11:30:00"},
    {"id": 4, "courseId": 1, "courseName": "计算机编程基础", "studentId": 3, "studentNumber": "20240003", "grade": 82, "createTime": "2024-07-10 10:20:00", "modifyTime": "2024-07-12 15:45:00"},
    {"id": 5, "courseId": 2, "courseName": "数据结构与算法", "studentId": 4, "studentNumber": "20240004", "grade": 95, "createTime": "2024-07-15 09:40:00", "modifyTime": "2024-07-18 14:20:00"}
  ]

  static async save (gradeForm: GradeForm): Promise<Result<void>> {
    console.log('gradeApi save params', gradeForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (gradeQueryForm: GradeQueryForm): Promise<Result<Page<Grade>>> {
    console.log('gradeApi find params', gradeQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(gradeApi.grades)
    return response.data
  }

  static async findById (id: number): Promise<Result<Grade>> {
    console.log('gradeApi findById id', id)
    let target = {}
    for (let a of gradeApi.grades) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Grade> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('gradeApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
