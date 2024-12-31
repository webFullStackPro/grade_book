export class FacultyQueryForm {
  universityId?: number;
  universityName?: string;
  name?: string;

  constructor(values: Partial<FacultyQueryForm>) {
    Object.assign(this, values);
  }
}
