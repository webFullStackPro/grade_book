import mockApi from "@/api/mockApi";

export default class facultyApi {
  static facultys = [
    {"id": 1, "universityId": 2, "universityName": "XYX大学", "name": "计算机科学学院", "establishmentDate": "2000-05-10", "contactPhone": "010-12345678", "email": "cs@xxu.edu.cn", "officeLocation": "信息楼3层", "website": "http://cs.xxu.edu.cn", "facultyDescription": "专注于计算机领域的教学与科研，培养创新型计算机人才。", "createTime": "2022-03-15 10:20:30", "modifyTime": "2023-09-20 14:10:15"},
    {"id": 2, "universityId": 3, "universityName": "YXY大学", "name": "经济管理学院", "establishmentDate": "1998-09-05", "contactPhone": "021-23456789", "email": "em@yyu.edu.cn", "officeLocation": "商科楼5层", "website": "http://em.yyu.edu.cn", "facultyDescription": "在经济与管理学科方面具有深厚的学术积淀和丰富的教学经验。", "createTime": "2021-11-25 09:15:00", "modifyTime": "2022-07-18 16:30:20"},
    {"id": 3, "universityId": 3, "universityName": "XYY大学", "name": "文学院", "establishmentDate": "1985-03-20", "contactPhone": "020-34567890", "email": "la@yyu.edu.cn", "officeLocation": "人文楼2层", "website": "http://la.yyu.edu.cn", "facultyDescription": "致力于文学研究与文化传承，师资力量雄厚，教学资源丰富。", "createTime": "2023-05-12 11:40:00", "modifyTime": "2024-02-08 08:50:35"},
    {"id": 4, "universityId": 1, "universityName": "ZYZ大学", "name": "工程学院", "establishmentDate": "1990-11-12", "contactPhone": "010-45678901", "email": "en@zzu.edu.cn", "officeLocation": "工科楼4层", "website": "http://en.zzu.edu.cn", "facultyDescription": "以工程实践为导向，培养具有扎实专业技能的工程人才。", "createTime": "2020-08-05 13:05:20", "modifyTime": "2023-04-03 15:20:45"},
    {"id": 5, "universityId": 2, "universityName": "XYZ大学", "name": "艺术学院", "establishmentDate": "1995-06-30", "contactPhone": "021-56789012", "email": "art@xxu.edu.cn", "officeLocation": "艺术楼6层", "website": "http://art.xxu.edu.cn", "facultyDescription": "专注于艺术创作与艺术教育，为学生提供广阔的艺术发展空间。", "createTime": "2022-09-18 14:30:10", "modifyTime": "2023-11-28 09:45:05"},
    {"id": 6, "universityId": 3, "universityName": "ZYX大学", "name": "理学院", "establishmentDate": "1988-08-15", "contactPhone": "020-67890123", "email": "sc@yyu.edu.cn", "officeLocation": "理科楼1层", "website": "http://sc.yyu.edu.cn", "facultyDescription": "在数学、物理等基础学科领域开展深入研究与教学。", "createTime": "2021-07-08 09:50:00", "modifyTime": "2022-12-10 11:10:20"}
  ]

  static async save (params) {
    console.log('facultyApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('facultyApi find params', params)
    const response = await mockApi.queryPageSuccessfully(facultyApi.facultys)
    return response.data
  }

  static async findById (id) {
    console.log('facultyApi findById id', id)
    let target = {}
    for (let a of facultyApi.facultys) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('facultyApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}