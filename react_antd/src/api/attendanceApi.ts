import mockApi from "@/api/mockApi";
import type {AttendanceForm} from '@/types/req/attendanceForm'
import type {AttendanceQueryForm} from '@/types/req/attendanceQueryForm'
import type {Attendance} from '@/types/resp/attendance'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";
import dayjs from "dayjs";

export default class attendanceApi {
  static attendances: Attendance[] = [
    {"id": 1, "courseId": 2, "courseName": "数据结构与算法", "studentId": 2, "studentNumber": "20240002", "attendanceDate": dayjs("2024-11-20"), "status": 30, "createTime": "2024-11-20 09:10:00", "modifyTime": "2024-11-20 16:30:00"},
    {"id": 2, "courseId": 4, "courseName": "高等数学", "studentId": 2, "studentNumber": "20240002", "attendanceDate": dayjs("2024-10-15"), "status": 10, "createTime": "2024-10-15 08:45:00", "modifyTime": "2024-10-15 17:20:00"},
    {"id": 3, "courseId": 3, "courseName": "微观经济学", "studentId": 1, "studentNumber": "20240001", "attendanceDate": dayjs("2024-12-05"), "status": 20, "createTime": "2024-12-05 10:05:00", "modifyTime": "2024-12-05 17:50:00"},
    {"id": 4, "courseId": 3, "courseName": "微观经济学", "studentId": 4, "studentNumber": "20240004", "attendanceDate": dayjs("2024-11-30"), "status": 20, "createTime": "2024-11-30 09:30:00", "modifyTime": "2024-11-30 17:10:00"},
    {"id": 5, "courseId": 3, "courseName": "微观经济学", "studentId": 1, "studentNumber": "20240001", "attendanceDate": dayjs("2024-10-25"), "status": 10, "createTime": "2024-10-25 08:55:00", "modifyTime": "2024-10-25 17:35:00"},
    {"id": 6, "courseId": 4, "courseName": "高等数学", "studentId": 2, "studentNumber": "20240002", "attendanceDate": dayjs("2024-11-10"), "status": 30, "createTime": "2024-11-10 09:20:00", "modifyTime": "2024-11-10 17:40:00"},
    {"id": 7, "courseId": 4, "courseName": "高等数学", "studentId": 1, "studentNumber": "20240001", "attendanceDate": dayjs("2024-10-08"), "status": 20, "createTime": "2024-10-08 09:00:00", "modifyTime": "2024-10-08 17:15:00"}
  ]

  static async save (attendanceForm: AttendanceForm): Promise<Result<void>> {
    console.log('attendanceApi save params', attendanceForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (attendanceQueryForm: AttendanceQueryForm): Promise<Result<Page<Attendance>>> {
    console.log('attendanceApi find params', attendanceQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(attendanceApi.attendances)
    return response.data
  }

  static async findById (id: number): Promise<Result<Attendance>> {
    console.log('attendanceApi findById id', id)
    let target = {}
    for (const a of attendanceApi.attendances) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Attendance> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('attendanceApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
