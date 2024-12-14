import mockApi from "@/api/mockApi";
import type {TeacherForm} from '@/types/req/teacherForm'
import type {TeacherQueryForm} from '@/types/req/teacherQueryForm'
import type {Teacher} from '@/types/resp/teacher'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class teacherApi {
  static teachers: Teacher[] = [
    {"id":1,"facultyId":101,"facultyName":"计算机科学与技术学院","name":"张小明","password":"123456","title":1,"gender":1,"contactPhone":"13812345678","email":"zhangxiaoming@example.com","profile":"该教师在教学和科研方面都有丰富经验，专注于算法研究领域。","createTime":"2024-05-10 14:30:20","modifyTime":"2024-06-15 10:10:05"},
    {"id":2,"facultyId":102,"facultyName":"外国语学院","name":"李红","password":"abcdef","title":1,"gender":2,"contactPhone":"13687654321","email":"lihong@example.com","profile":"擅长英语教学，多次参与国际交流活动，具备优秀的口语表达能力。","createTime":"2024-03-20 09:20:15","modifyTime":"2024-04-05 16:40:30"},
    {"id":3,"facultyId":103,"facultyName":"数学与统计学院","name":"王强","password":"654321","title":3,"gender":1,"contactPhone":"18823456789","email":"wangqiang@example.com","profile":"在数学建模和数据分析领域有深入研究，指导学生多次获奖。","createTime":"2024-07-08 11:05:40","modifyTime":"2024-08-12 08:30:10"},
    {"id":4,"facultyId":104,"facultyName":"物理与电子工程学院","name":"刘梅","password":"qwerty","title":3,"gender":2,"contactPhone":"13398765432","email":"liummei@example.com","profile":"专注于物理实验教学和电子技术研发，教学成果显著。","createTime":"2024-02-15 15:15:00","modifyTime":"2024-03-01 13:25:30"},
    {"id":5,"facultyId":105,"facultyName":"化学化工学院","name":"陈杰","password":"asdfgh","title":1,"gender":1,"contactPhone":"15876543210","email":"chenjie@example.com","profile":"从事化学教学与科研工作多年，在有机合成方面有独特见解。","createTime":"2024-04-25 17:40:00","modifyTime":"2024-05-08 09:50:20"}
  ]

  static async save (teacherForm: TeacherForm): Promise<Result<void>> {
    console.log('teacherApi save params', teacherForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (teacherQueryForm: TeacherQueryForm): Promise<Result<Page<Teacher>>> {
    console.log('teacherApi find params', teacherQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(teacherApi.teachers)
    return response.data
  }

  static async findById (id: number): Promise<Result<Teacher>> {
    console.log('teacherApi findById id', id)
    let target = {}
    for (let a of teacherApi.teachers) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Teacher> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('teacherApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
