export class GradeQueryForm {
  courseId?: number;
  courseName?: string;
  studentId?: number;
  studentNumber?: string;

  constructor(values: Partial<GradeQueryForm>) {
    Object.assign(this, values);
  }
}
