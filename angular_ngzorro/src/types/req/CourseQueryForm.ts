export class CourseQueryForm {
  facultyId?: number;
  facultyName?: string;
  teacherId?: number;
  teacherName?: string;
  name?: string;

  constructor(values: Partial<CourseQueryForm>) {
    Object.assign(this, values);
  }
}
