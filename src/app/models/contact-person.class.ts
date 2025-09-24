export class Contact {
  id?: string;
  contactName: string = '';
  employmentType: string = '';
  email: string = '';
  phone: string = '';
  


  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.contactName = obj.contact_name || '';
      this.employmentType = obj.employment_type || '';
      this.email = obj.email || '';
      this.phone = obj.phone || '';
    }
  }

  toDbContact(): any {
    return {
      contact_name: this.contactName,
      employment_type: this.employmentType,
      email: this.email,
      phone: this.phone
    };
  }
}