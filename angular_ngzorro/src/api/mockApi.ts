import type {Response} from '../types/response'
import type {Result} from '../types/result'
import type {Page} from '../types/page'
import {map, Observable, timer} from 'rxjs';

export default class MockApi {

  private static delay = 300; // 延迟的时间，单位为毫秒

  static operateSuccessfully (): Observable<Response<void>> {
    const result: Result<void> = {
      code: 1,
      msg: '操作成功'
    };
    const response: Response<void> = {
      status: 200,
      data: result
    }
    return timer(this.delay).pipe(map(() => (response)));
  }

  static operateSuccessfullyWithData (data: object): Observable<Response<object>> {
    const result: Result<object> = {
      code: 1,
      msg: '操作成功',
      data: Object.assign({}, data)
    };
    const response: Response<object> = {
      status: 200,
      data: result
    }
    return timer(this.delay).pipe(map(() => (response)));
  }

  static operateUnsuccessfully (msg: string): Observable<Response<object>> {
    const result: Result<object> = {
      code: 0,
      msg: msg ? msg : '操作失败'
    };
    const response: Response<object> = {
      status: 200,
      data: result
    }
    return timer(this.delay).pipe(map(() => (response)));
  }

  static queryPageSuccessfully (data: Array<object>): Observable<Response<Page<object>>> {
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
    return timer(this.delay).pipe(map(() => (response)));
  }
}
