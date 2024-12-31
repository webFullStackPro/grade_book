export class UpdatePassForm {
  oldPass?: string;
  newPass?: string;
  newPass2?: string;

  constructor(values: Partial<UpdatePassForm>) {
    Object.assign(this, values);
  }
}
