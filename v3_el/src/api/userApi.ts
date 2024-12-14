import MockApi from '@/api/mockApi'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {LoginSession} from '@/types/resp/loginSession'
import type {LoginForm} from '@/types/req/loginForm'
import type {UpdatePassForm} from '@/types/req/updatePassForm'

export default class userApi {
  static adminLoginSession: LoginSession = {
    token: '12345678901',
    type: 1,
    uid: 111,
    username: 'admin'
  }
  static teacherLoginSession: LoginSession = {
    token: '12345678902',
    type: 2,
    uid: 222,
    username: 'teacher_test_1'
  }
  static studentLoginSession: LoginSession = {
    token: '12345678903',
    type: 3,
    uid: 333,
    username: 'student_test_1'
  }

  static async login (params: LoginForm): Promise<Result<LoginSession>> {
    console.log('userApi login params', params)
    let returnData = userApi.adminLoginSession
    if (params.type === 2) {
      returnData = userApi.teacherLoginSession
    }
    if (params.type === 3) {
      returnData = userApi.studentLoginSession
    }
    const response: Response<object> = await MockApi.operateSuccessfullyWithData(returnData)
    return response.data
  }

  static async logout (): Promise<Result<unknown>> {
    console.log('userApi logout')
    const response: Response<unknown> = await MockApi.operateSuccessfully()
    return response.data
  }

  static async updatePass (params: UpdatePassForm): Promise<Result<void>> {
    console.log('userApi updatePass params', params)
    const response: Response<void> = await MockApi.operateSuccessfully()
    return response.data
  }
}
