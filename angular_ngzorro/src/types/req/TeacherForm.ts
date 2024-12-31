export class TeacherForm {
  id?: number;
  facultyId?: number;
  facultyName?: string;
  name?: string;
  password?: string;
  title?: number | undefined;
  gender?: number | undefined;
  contactPhone?: string;
  email?: string;
  profile?: string;

  constructor(values: Partial<TeacherForm>) {
    Object.assign(this, values);
  }
}
