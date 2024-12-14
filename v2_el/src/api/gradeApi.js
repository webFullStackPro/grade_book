import mockApi from "@/api/mockApi";

export default class gradeApi {
  static grades = [
    {"id": 1, "courseId": 3, "courseName": "高等数学", "studentId": 2, "studentNumber": "20240002", "grade": 85, "createTime": "2024-06-30 14:30:00", "modifyTime": "2024-07-05 09:00:00"},
    {"id": 2, "courseId": 3, "courseName": "高等数学", "studentId": 1, "studentNumber": "20240001", "grade": 78, "createTime": "2024-06-30 15:00:00", "modifyTime": "2024-07-01 10:15:00"},
    {"id": 3, "courseId": 3, "courseName": "高等数学", "studentId": 4, "studentNumber": "20240004", "grade": 92, "createTime": "2024-06-30 14:45:00", "modifyTime": "2024-07-03 11:30:00"},
    {"id": 4, "courseId": 1, "courseName": "计算机编程基础", "studentId": 3, "studentNumber": "20240003", "grade": 82, "createTime": "2024-07-10 10:20:00", "modifyTime": "2024-07-12 15:45:00"},
    {"id": 5, "courseId": 2, "courseName": "数据结构与算法", "studentId": 4, "studentNumber": "20240004", "grade": 95, "createTime": "2024-07-15 09:40:00", "modifyTime": "2024-07-18 14:20:00"}
  ]

  static async save (params) {
    console.log('gradeApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('gradeApi find params', params)
    const response = await mockApi.queryPageSuccessfully(gradeApi.grades)
    return response.data
  }

  static async findById (id) {
    console.log('gradeApi findById id', id)
    let target = {}
    for (let a of gradeApi.grades) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('gradeApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}