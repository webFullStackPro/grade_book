export interface Student {
  id: number;
  studentNumber: string;
  name: string;
  password: string;
  password2?: string;
  gender: number;
  birthDate: Dayjs;
  majorId: number;
  majorName: string;
  grade: number;
  contactPhone: string;
  email: string;
  province: string;
  provinceName: string;
  city: string;
  cityName: string;
  area: string;
  areaName: string;
  provinceCityArea?: string[];
  address: string;
  enrollmentDate: Dayjs;
  graduationDate: Dayjs;
  createTime: string;
  modifyTime: string;
  verificationCode?: string;
}