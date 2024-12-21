export interface Attendance {
  id: number;
  courseId: number;
  courseName: string;
  studentId: number;
  studentNumber: string;
  attendanceDate: Dayjs;
  status: number;
  createTime: string;
  modifyTime: string;
}