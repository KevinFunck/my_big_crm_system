export class Customer {
  companyName: string = '';
  legalForm: string = '';
  industry: string = '';
  address: string = ''; 
  zip: string = '';
  city: string = '';
  country: string = '';
  phone: string = '';
  email: string = '';
  website: string = '';
  vat: string = '';
  profileImage: string = '';

  constructor(obj?: any) {
    if (obj) {
      this.companyName = obj.company_name || '';
      this.legalForm = obj.legal_form || '';
      this.industry = obj.industry || '';
      this.address = obj.address || ''; 
      this.zip = obj.zip || '';
      this.city = obj.city || '';
      this.country = obj.country || '';
      this.phone = obj.phone || '';
      this.email = obj.email || '';
      this.website = obj.website || '';
      this.vat = obj.vat_number || '';
      this.profileImage = obj.image_url || '';
    }
  }

  toDbCustomer(): any {
    return {
      company_name: this.companyName,
      legal_form: this.legalForm,
      industry: this.industry,
      address: this.address, 
      zip: this.zip,
      city: this.city,
      country: this.country,
      phone: this.phone,
      email: this.email,
      website: this.website,
      vat_number: this.vat,
      image_url: this.profileImage,
    };
  }
}