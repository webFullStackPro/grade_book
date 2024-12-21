import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from '@/types/page'

export default class MockApi {
  static operateSuccessfully (): Promise<Response<void>> {
    const result: Result<void> = {
      code: 1,
      msg: '操作成功'
    };
    const response: Response<void> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }

  static operateSuccessfullyWithData (data: object): Promise<Response<object>> {
    const result: Result<object> = {
      code: 1,
      msg: '操作成功',
      data: Object.assign({}, data)
    };
    const response: Response<object> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }

  static operateUnsuccessfully (msg: string): Promise<Response<object>> {
    const result: Result<object> = {
      code: 0,
      msg: msg ? msg : '操作失败'
    };
    const response: Response<object> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }

  static queryPageSuccessfully (data: Array<object>): Promise<Response<Page<object>>> {
    const page: Page<object> = {
      total: (data && data.length ? data.length: 0),
      list: Object.assign([], data)
    }
    const result: Result<Page<object>> = {
      code: 1,
      msg: '操作成功',
      data: page
    };
    const response: Response<Page<object>> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }
}
