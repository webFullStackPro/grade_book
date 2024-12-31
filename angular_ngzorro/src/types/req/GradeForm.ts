export class GradeForm {
  id?: number;
  courseId?: number;
  courseName?: string;
  studentId?: number;
  studentNumber?: string;
  grade?: number;

  constructor(values: Partial<GradeForm>) {
    Object.assign(this, values);
  }
}
