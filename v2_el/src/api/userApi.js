import './base'
import mockApi from "@/api/mockApi";
import {ADMIN_USERNAME, PASSWORD, STUDENT_USERNAME, TEACHER_USERNAME} from "@/const";

export default class userApi {
  static adminLoginSession = {
    token: '12345678901',
    type: 1,
    uid: 111,
    username: ADMIN_USERNAME
  }
  static teacherLoginSession = {
    token: '12345678902',
    type: 2,
    uid: 222,
    username: TEACHER_USERNAME
  }
  static studentLoginSession = {
    token: '12345678903',
    type: 3,
    uid: 333,
    username: STUDENT_USERNAME
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
    if (params.username !== returnData.username || params.password !== PASSWORD) {
      const response = await mockApi.operateUnsuccessfully('用户名或密码不正确')
      return response.data
    }
    const response = await mockApi.operateSuccessfullyWithData(returnData)
    return response.data
  }

  static async logout() {
    console.log('userApi logout')
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async updatePass(params) {
    console.log('userApi updatePass params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}
