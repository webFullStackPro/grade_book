export interface AttendanceForm {
  id?: number;
  courseId: number;
  courseName: string;
  studentId: number;
  studentNumber: string;
  attendanceDate: Dayjs;
  status: number | undefined;
}
