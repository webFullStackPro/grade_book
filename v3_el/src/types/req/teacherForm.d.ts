export interface TeacherForm {
  id?: number;
  facultyId: number;
  facultyName: string;
  name: string;
  password: string;
  title: number | undefined;
  gender: number | undefined;
  contactPhone: string;
  email: string;
  profile: string;
}
