export class UniversityForm {
  id?: number;
  name?: string;
  establishmentDate?: string;
  contactPhone?: string;
  email?: string;
  province?: string;
  city?: string;
  area?: string;
  location?: string;
  universityDescription?: string;

  constructor(values: Partial<UniversityForm>) {
    Object.assign(this, values);
  }
}
