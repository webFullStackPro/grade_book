export class TeacherQueryForm {
  facultyId?: number;
  facultyName?: string;
  name?: string;
  title?: number | undefined;
  gender?: number | undefined;
  contactPhone?: string;

  constructor(values: Partial<TeacherQueryForm>) {
    Object.assign(this, values);
  }
}
