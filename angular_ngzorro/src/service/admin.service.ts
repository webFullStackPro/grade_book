import {Injectable} from '@angular/core';
import {Admin} from '../types/resp/Admin';
import {AdminForm} from '../types/req/AdminForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {AdminQueryForm} from '../types/req/AdminQueryForm';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  admins: Admin[] = [
    {"id":1,"username":"zhangsan","password":"IeMKfe","name":"张三","createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"username":"lisi","password":"cnvwZf","name":"李四",    "createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"username":"wangwu","password":"idEJuE","name":"王五",  "createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"username":"zhaoliu","password":"kzKUqw","name":"赵六", "createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"username":"liuqi","password":"IUQkyn","name":"刘七",   "createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"username":"chenba","password":"Pbhdnx","name":"陈八",  "createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"username":"huangjiu","password":"CvOnkE","name":"黄九","createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]
  constructor() {
  }

  save (adminForm: AdminForm): Observable<Result<void>> {
    console.log('adminApi save params', adminForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (adminQueryForm: AdminQueryForm): Observable<Result<Page<Admin>>> {
    console.log('adminApi find params', adminQueryForm)
    return MockApi.queryPageSuccessfully(this.admins).pipe(
      map((response: Response<Result<Page<Admin>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Admin>> {
    console.log('adminApi findById id', id)
    let target = {}
    for (const a of this.admins) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Admin>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('adminApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
