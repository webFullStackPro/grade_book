export class AttendanceQueryForm {
  courseId?: number;
  courseName?: string;
  studentId?: number;
  studentNumber?: string;
  status?: number | undefined;

  constructor(values: Partial<AttendanceQueryForm>) {
    Object.assign(this, values);
  }
}
