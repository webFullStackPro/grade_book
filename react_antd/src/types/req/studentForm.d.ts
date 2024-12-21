export interface StudentForm {
  id?: number;
  studentNumber: string;
  name: string;
  password: string;
  gender: number | undefined;
  birthDate: Dayjs;
  majorId: number;
  majorName: string;
  grade: number;
  contactPhone: string;
  email: string;
  province: string;
  city: string;
  area: string;
  address: string;
  enrollmentDate: Dayjs;
  graduationDate: Dayjs;
}
