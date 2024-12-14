import mockApi from "@/api/mockApi";
import type {StudentForm} from '@/types/req/studentForm'
import type {StudentQueryForm} from '@/types/req/studentQueryForm'
import type {Student} from '@/types/resp/student'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class studentApi {
  static students: Student[] = [
    {"id": 1, "studentNumber": "20240001", "name": "张小明", "password": "abc123456", "gender": 1, "birthDate": "2002-05-10", "majorId": 3, "majorName": "计算机科学与技术", "grade": 3, "contactPhone": "13812345678", "email": "zhangxiaoming@example.com", "province": "11", "provinceName": "北京市", "city": "1101", "cityName": "北京市", "area": "110108", "areaName": "海淀区", "address": "中关村大街1号", "enrollmentDate": "2020-09-01", "graduationDate": "2024-06-30", "createTime": "2024-12-13 20:15:25", "modifyTime": "2024-12-13 20:15:25"},
    {"id": 2, "studentNumber": "20240002", "name": "李华", "password": "def654321", "gender": 1, "birthDate": "2003-03-15", "majorId": 3, "majorName": "软件工程", "grade": 2, "contactPhone": "13687654321", "email": "lihua@example.com", "province": "31", "provinceName": "上海市", "city": "3101", "cityName": "上海市", "area": "310115", "areaName": "浦东新区", "address": "世纪大道88号", "enrollmentDate": "2021-09-01", "graduationDate": "2025-06-30", "createTime": "2024-12-11 20:15:25", "modifyTime": "2024-12-10 20:15:25"},
    {"id": 3, "studentNumber": "20240003", "name": "王强", "password": "ghi789012", "gender": 1, "birthDate": "2002-11-20", "majorId": 4, "majorName": "电子信息工程", "grade": 3, "contactPhone": "13923456789", "email": "wangqiang@example.com", "province": "44", "provinceName": "广东省", "city": "4401", "cityName": "广州市", "area": "440106", "areaName": "天河区", "address": "五山路381号", "enrollmentDate": "2020-09-01", "graduationDate": "2024-06-30", "createTime": "2024-12-11 20:15:25", "modifyTime": "2024-12-12 20:15:25"},
    {"id": 4, "studentNumber": "20240004", "name": "刘悦", "password": "jkl345678", "gender": 1, "birthDate": "2003-08-05", "majorId": 4, "majorName": "自动化", "grade": 1, "contactPhone": "13312345678", "email": "liuyue@example.com", "province": "11", "provinceName": "北京市", "city": "1101", "cityName": "北京市", "area": "110105", "areaName": "朝阳区", "address": "望京街10号", "enrollmentDate": "2023-09-01", "graduationDate": "2027-06-30", "createTime": "2024-12-12 20:15:25", "modifyTime": "2024-12-13 20:15:25"},
    {"id": 5, "studentNumber": "20240005", "name": "陈琳", "password": "mno987654", "gender": 2, "birthDate": "2004-02-18", "majorId": 4, "majorName": "通信工程", "grade": 1, "contactPhone": "13787654321", "email": "chenlin@example.com", "province": "31", "provinceName": "上海市", "city": "3101", "cityName": "上海市", "area": "310104", "areaName": "徐汇区", "address": "衡山路516号", "enrollmentDate": "2024-09-01", "graduationDate": "2028-06-30", "createTime": "2024-12-12 20:15:25", "modifyTime": "2024-12-12 20:15:25"},
    {"id": 6, "studentNumber": "20240006", "name": "赵阳", "password": "pqr135790", "gender": 1, "birthDate": "2003-06-25", "majorId": 3, "majorName": "人工智能", "grade": 3, "contactPhone": "13123456789", "email": "zhaoyang@example.com", "province": "44", "provinceName": "广东省", "city": "4403", "cityName": "深圳市", "area": "440305", "areaName": "南山区", "address": "科技园南区1号", "enrollmentDate": "2021-09-01", "graduationDate": "2024-06-30", "createTime": "2024-12-11 20:15:25", "modifyTime": "2024-12-13 20:15:25"},
    {"id": 7, "studentNumber": "20240007", "name": "孙磊", "password": "stu246810", "gender": 1, "birthDate": "2004-04-12", "majorId": 4, "majorName": "电气工程及其自动化", "grade": 3, "contactPhone": "13287654321", "email": "sunlei@example.com", "province": "11", "provinceName": "北京市", "city": "1101", "cityName": "北京市", "area": "110114", "areaName": "昌平区", "address": "沙河高教园区南三街5号", "enrollmentDate": "2024-09-01", "graduationDate": "2027-06-30", "createTime": "2024-12-10 20:15:25", "modifyTime": "2024-12-12 20:15:25"}
  ]

  static async save (studentForm: StudentForm): Promise<Result<void>> {
    console.log('studentApi save params', studentForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (studentQueryForm: StudentQueryForm): Promise<Result<Page<Student>>> {
    console.log('studentApi find params', studentQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(studentApi.students)
    return response.data
  }

  static async findById (id: number): Promise<Result<Student>> {
    console.log('studentApi findById id', id)
    let target = {}
    for (let a of studentApi.students) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Student> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('studentApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
