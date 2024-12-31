export class UniversityQueryForm {
  name?: string;
  location?: string;

  constructor(values: Partial<UniversityQueryForm>) {
    Object.assign(this, values);
  }
}
