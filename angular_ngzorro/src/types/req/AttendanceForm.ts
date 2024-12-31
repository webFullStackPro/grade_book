export class AttendanceForm {
  id?: number;
  courseId?: number;
  courseName?: string;
  studentId?: number;
  studentNumber?: string;
  attendanceDate?: string;
  status?: number | undefined;

  constructor(values: Partial<AttendanceForm>) {
    Object.assign(this, values);
  }
}
