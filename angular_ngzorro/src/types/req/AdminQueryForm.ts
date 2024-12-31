export class AdminQueryForm {
  username?: string;
  name?: string;

  constructor(values: Partial<AdminQueryForm>) {
    Object.assign(this, values);
  }
}
