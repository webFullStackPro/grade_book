import mockApi from "@/api/mockApi";
import type {MajorForm} from '@/types/req/majorForm'
import type {MajorQueryForm} from '@/types/req/majorQueryForm'
import type {Major} from '@/types/resp/major'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class majorApi {
  static majors: Major[] = [
    {"id": 1, "facultyId": 1, "facultyName": "计算机科学学院", "name": "软件工程", "degreeType": 2, "duration": 4, "contactPhone": "010-88886666", "email": "se@cs.edu.cn", "officeLocation": "信息楼 305 室", "majorDescription": "本专业专注于软件系统的开发、设计与维护，培养学生具备扎实的编程基础和软件工程实践能力。", "createTime": "2020-09-01 10:00:00", "modifyTime": "2020-10-15 15:30:00"},
    {"id": 2, "facultyId": 2, "facultyName": "经济管理学院", "name": "会计学", "degreeType": 2, "duration": 4, "contactPhone": "021-66668888", "email": "ac@em.edu.cn", "officeLocation": "商科楼 402 室", "majorDescription": "主要学习财务会计、管理会计等知识，为学生在会计领域的职业发展奠定坚实基础。", "createTime": "2021-09-05 14:00:00", "modifyTime": "2021-11-05 09:45:00"},
    {"id": 3, "facultyId": 3, "facultyName": "计算机科学学院", "name": "计算机科学与技术", "degreeType": 2, "duration": 4, "contactPhone": "010-55559999", "email": "cs@cs.edu.cn", "officeLocation": "信息楼 408 室", "majorDescription": "涵盖计算机硬件、软件及算法等多方面知识，培养全面的计算机专业人才。", "createTime": "2022-08-20 09:30:00", "modifyTime": "2022-12-01 16:20:00"},
    {"id": 4, "facultyId": 4, "facultyName": "文学院", "name": "汉语言文学", "degreeType": 3, "duration": 4, "contactPhone": "020-99995555", "email": "ch@la.edu.cn", "officeLocation": "人文楼 310 室", "majorDescription": "深入研究汉语语言和文学作品，提升学生的文学素养与语言表达能力。", "createTime": "2023-09-10 11:20:00", "modifyTime": "2023-10-25 13:15:00"},
    {"id": 5, "facultyId": 5, "facultyName": "理学院", "name": "数学与应用数学", "degreeType": 1, "duration": 4, "contactPhone": "021-77778888", "email": "ma@sc.edu.cn", "officeLocation": "理科楼 206 室", "majorDescription": "着重培养学生在数学理论和应用方面的能力，为科研和教育等领域输送人才。", "createTime": "2024-08-15 13:45:00", "modifyTime": "2024-11-18 17:00:00"}
  ]

  static async save (majorForm: MajorForm): Promise<Result<void>> {
    console.log('majorApi save params', majorForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (majorQueryForm: MajorQueryForm): Promise<Result<Page<Major>>> {
    console.log('majorApi find params', majorQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(majorApi.majors)
    return response.data
  }

  static async findById (id: number): Promise<Result<Major>> {
    console.log('majorApi findById id', id)
    let target = {}
    for (let a of majorApi.majors) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Major> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('majorApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
