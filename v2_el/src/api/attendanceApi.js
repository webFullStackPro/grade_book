import mockApi from "@/api/mockApi";

export default class attendanceApi {
  static attendances = [
    {"id": 1, "courseId": 2, "courseName": "数据结构与算法", "studentId": 2, "studentNumber": "20240002", "attendanceDate": "2024-11-20", "status": 30, "createTime": "2024-11-20 09:10:00", "modifyTime": "2024-11-20 16:30:00"},
    {"id": 2, "courseId": 4, "courseName": "高等数学", "studentId": 2, "studentNumber": "20240002", "attendanceDate": "2024-10-15", "status": 10, "createTime": "2024-10-15 08:45:00", "modifyTime": "2024-10-15 17:20:00"},
    {"id": 3, "courseId": 3, "courseName": "微观经济学", "studentId": 1, "studentNumber": "20240001", "attendanceDate": "2024-12-05", "status": 20, "createTime": "2024-12-05 10:05:00", "modifyTime": "2024-12-05 17:50:00"},
    {"id": 4, "courseId": 3, "courseName": "微观经济学", "studentId": 4, "studentNumber": "20240004", "attendanceDate": "2024-11-30", "status": 20, "createTime": "2024-11-30 09:30:00", "modifyTime": "2024-11-30 17:10:00"},
    {"id": 5, "courseId": 3, "courseName": "微观经济学", "studentId": 1, "studentNumber": "20240001", "attendanceDate": "2024-10-25", "status": 10, "createTime": "2024-10-25 08:55:00", "modifyTime": "2024-10-25 17:35:00"},
    {"id": 6, "courseId": 4, "courseName": "高等数学", "studentId": 2, "studentNumber": "20240002", "attendanceDate": "2024-11-10", "status": 30, "createTime": "2024-11-10 09:20:00", "modifyTime": "2024-11-10 17:40:00"},
    {"id": 7, "courseId": 4, "courseName": "高等数学", "studentId": 1, "studentNumber": "20240001", "attendanceDate": "2024-10-08", "status": 20, "createTime": "2024-10-08 09:00:00", "modifyTime": "2024-10-08 17:15:00"}
  ]

  static async save (params) {
    console.log('attendanceApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('attendanceApi find params', params)
    const response = await mockApi.queryPageSuccessfully(attendanceApi.attendances)
    return response.data
  }

  static async findById (id) {
    console.log('attendanceApi findById id', id)
    let target = {}
    for (let a of attendanceApi.attendances) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('attendanceApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}