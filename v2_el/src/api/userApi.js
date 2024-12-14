import './base'
import mockApi from "@/api/mockApi";

export default class userApi {
  static adminLoginSession = {
    token: '12345678901',
    type: 1,
    uid: 111,
    username: 'admin'
  }
  static teacherLoginSession = {
    token: '12345678902',
    type: 2,
    uid: 222,
    username: 'teacher_test_1'
  }
  static studentLoginSession = {
    token: '12345678903',
    type: 3,
    uid: 333,
    username: 'student_test_1'
  }

  static async login(params) {
    console.log('userApi login params', params)
    let returnData = userApi.adminLoginSession
    if (params.type === 2) {
      returnData = userApi.teacherLoginSession
    }
    if (params.type === 3) {
      returnData = userApi.studentLoginSession
    }
    return mockApi.operateSuccessfullyWithData(returnData)
  }

  static async logout() {
    console.log('userApi logout')
    return mockApi.operateSuccessfully()
  }

  static async updatePass(params) {
    console.log('userApi updatePass params', params)
    return mockApi.operateSuccessfully()
  }
}
