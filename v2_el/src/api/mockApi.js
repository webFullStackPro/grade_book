export default class mockApi {
  static operateSuccessfully () {
  return Promise.resolve({
      status: 200,
      data: {
        code: 1,
        msg: '操作成功'
      }
    })
  }

  static operateSuccessfullyWithData (data) {
    return Promise.resolve({
      status: 200,
      data: {
        code: 1,
        msg: '操作成功',
        data: Object.assign({}, data)
      }
    })
  }

  static operateUnsuccessfully (msg) {
    return Promise.resolve({
      status: 200,
      data: {
        code: 0,
        msg: msg ? msg : '操作失败'
      }
    })
  }

  static queryPageSuccessfully (data) {
    return Promise.resolve({
      status: 200,
      data: {
        code: 1,
        msg: '操作成功',
        data: {
            total: (data && data.length ? data.length: 0),
            list: Object.assign([], data)
        }
      }
    })
  }

  static queryByIdSuccessfully (data) {
    return Promise.resolve({
      status: 200,
      data: {
        code: 1,
        msg: '操作成功',
        data: Object.assign({}, data)
      }
    })
  }
}