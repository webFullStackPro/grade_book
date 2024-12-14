import type {TeacherForm} from "@/types/req/teacherForm";

export interface TeacherRegisterForm extends TeacherForm {
  password2: string;
  verificationCode: string;
}
