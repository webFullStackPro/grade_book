export interface AttendanceForm {
  id?: number;
  courseId: number;
  courseName: string;
  studentId: number;
  studentNumber: string;
  attendanceDate: string;
  status: number | undefined;
}
