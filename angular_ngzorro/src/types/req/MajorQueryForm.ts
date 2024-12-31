export class MajorQueryForm {
  facultyId?: number;
  facultyName?: string;
  name?: string;
  degreeType?: number | undefined;

  constructor(values: Partial<MajorQueryForm>) {
    Object.assign(this, values);
  }
}
