export class ContactPerson {
  id: string = '';
  contactName: string = '';
  employmentType: string = '';
  email: string = '';
  phone: string = '';
  customer_id: string = '';

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id || '';
      this.contactName = obj.contact_name || '';
      this.employmentType = obj.employment_type || '';
      this.email = obj.email || '';
      this.phone = obj.phone || '';
      this.customer_id = obj.customer_id || '';
    }
  }

  
  toDbContactPerson(): any {
    return {
      contact_name: this.contactName,
      employment_type: this.employmentType,
      email: this.email,
      phone: this.phone,
      customer_id: this.customer_id 
    };
  }
}