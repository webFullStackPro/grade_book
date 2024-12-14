import mockApi from "@/api/mockApi";

export default class adminApi {
  static admins = [
    {"id":1,"username":"zhangsan","password":"IeMKfe","name":"张三","createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"username":"lisi","password":"cnvwZf","name":"李四",    "createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"username":"wangwu","password":"idEJuE","name":"王五",  "createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"username":"zhaoliu","password":"kzKUqw","name":"赵六", "createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"username":"liuqi","password":"IUQkyn","name":"刘七",   "createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"username":"chenba","password":"Pbhdnx","name":"陈八",  "createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"username":"huangjiu","password":"CvOnkE","name":"黄九","createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]

  static async save (params) {
    console.log('adminApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('adminApi find params', params)
    const response = await mockApi.queryPageSuccessfully(adminApi.admins)
    return response.data
  }

  static async findById (id) {
    console.log('adminApi findById id', id)
    let target = {}
    for (let a of adminApi.admins) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('adminApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}