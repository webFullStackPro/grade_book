export class AdminForm {
  id?: number;
  username?: string;
  password?: string;
  name?: string;

  constructor(values: Partial<AdminForm>) {
    Object.assign(this, values);
  }
}
