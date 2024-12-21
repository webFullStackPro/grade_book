import mockApi from "@/api/mockApi";
import type {UniversityForm} from '@/types/req/universityForm'
import type {UniversityQueryForm} from '@/types/req/universityQueryForm'
import type {University} from '@/types/resp/university'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";
import dayjs from 'dayjs'

export default class universityApi {
  static universitys: University[] = [
    {"id": 1, "name": "XX科技大学", "establishmentDate": dayjs("2021-08-09"), "contactPhone": "010-88886666", "email": "xxkjdx@abc.com", "province": "11", "provinceName": "北京市", "city": "1101", "cityName": "北京市", "area": "110108", "areaName": "海淀区", "location": "XX街道XX号", "universityDescription": "这是一所专注于科技领域研究与教学的高等学府，有着优秀的师资力量和完善的教学设施。", "createTime": "2024-12-10 20:15:18", "modifyTime": "2024-12-13 20:15:18"},
    {"id": 2, "name": "XX师范大学", "establishmentDate": dayjs("2022-07-22"), "contactPhone": "021-66668888", "email": "xxsfdx@edu.com", "province": "31", "provinceName": "上海市", "city": "3101", "cityName": "上海市", "area": "310104", "areaName": "徐汇区", "location": "XX路XX号", "universityDescription": "以培养优秀教育人才为主要目标，具备深厚的人文底蕴和丰富的教学实践资源。", "createTime": "2024-12-13 20:15:18", "modifyTime": "2024-12-10 20:15:18"},
    {"id": 3, "name": "XX理工大学", "establishmentDate": dayjs("2023-06-11"), "contactPhone": "0755-9999555", "email": "xxlgdx@def.com", "province": "44", "provinceName": "广东省", "city": "4403", "cityName": "深圳市", "area": "440305", "areaName": "南山区", "location": "XX大道XX号", "universityDescription": "在理工科专业方面有着很强的学科实力，积极开展产学研合作。", "createTime": "2024-12-13 20:15:18", "modifyTime": "2024-12-13 20:15:18"},
    {"id": 4, "name": "XX财经大学", "establishmentDate": dayjs("2024-11-16"), "contactPhone": "010-55558888", "email": "xxcjdx@ggg.com", "province": "11", "provinceName": "北京市", "city": "1101", "cityName": "北京市", "area": "110105", "areaName": "朝阳区", "location": "XX街XX号", "universityDescription": "专注于财经领域的人才培养和学术研究，为社会输送大量经济金融专业人才。", "createTime": "2024-12-10 20:15:18", "modifyTime": "2024-12-10 20:15:18"},
  ]

  static async save (universityForm: UniversityForm): Promise<Result<void>> {
    console.log('universityApi save params', universityForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (universityQueryForm: UniversityQueryForm): Promise<Result<Page<University>>> {
    console.log('universityApi find params', universityQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(universityApi.universitys)
    return response.data
  }

  static async findById (id: number): Promise<Result<University>> {
    console.log('universityApi findById id', id)
    let target = {}
    for (const a of universityApi.universitys) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<University> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('universityApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
