export class LoginForm {
  username?: string;
  password?: string;
  type?: number;
  verificationCode?: string;

  constructor(values: Partial<LoginForm>) {
    Object.assign(this, values);
  }
}
