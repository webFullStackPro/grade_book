export class FacultyForm {
  id?: number;
  universityId?: number;
  universityName?: string;
  name?: string;
  establishmentDate?: string;
  contactPhone?: string;
  email?: string;
  officeLocation?: string;
  website?: string;
  facultyDescription?: string;

  constructor(values: Partial<FacultyForm>) {
    Object.assign(this, values);
  }
}
