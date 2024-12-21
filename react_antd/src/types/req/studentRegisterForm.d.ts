import type {StudentForm} from "@/types/req/studentForm";

export interface StudentRegisterForm extends StudentForm {
  password2: string;
  verificationCode: string;
}
