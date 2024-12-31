export class StudentQueryForm {
  studentNumber?: string;
  gender?: number | undefined;
  majorId?: number;
  majorName?: string;
  grade?: number | undefined;
  contactPhone?: string;

  constructor(values: Partial<StudentQueryForm>) {
    Object.assign(this, values);
  }
}
