export class CourseForm {
  id?: number;
  facultyId?: number;
  facultyName?: string;
  teacherId?: number;
  teacherName?: string;
  code?: string;
  name?: string;
  credit?: number;
  courseDescription?: string;

  constructor(values: Partial<CourseForm>) {
    Object.assign(this, values);
  }
}
