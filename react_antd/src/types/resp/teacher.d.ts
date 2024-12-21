export interface Teacher {
  id: number;
  facultyId: number;
  facultyName: string;
  name: string;
  password: string;
  password2?: string;
  title: number;
  gender: number;
  contactPhone: string;
  email: string;
  profile: string;
  createTime: string;
  modifyTime: string;
  verificationCode?: string;
}