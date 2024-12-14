export interface AttendanceQueryForm {
  courseId: number;
  courseName: string;
  studentId: number;
  studentNumber: string;
  status: number | undefined;
}