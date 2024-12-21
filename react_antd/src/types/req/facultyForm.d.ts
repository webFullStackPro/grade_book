export interface FacultyForm {
  id?: number;
  universityId: number;
  universityName: string;
  name: string;
  establishmentDate: Dayjs;
  contactPhone: string;
  email: string;
  officeLocation: string;
  website: string;
  facultyDescription: string;
}
