import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { Router } from '@angular/router';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '@models/customer.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, FormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  // Holds the file input change event when a new image is selected
  imageChangedEvent: any = '';
  // Stores the base64 string of the cropped image as the user adjusts the cropper
  croppedImage: string | null = null;
  // The final cropped image base64 string after user confirms the crop
  finalImage: string | null = null;

  customer: Customer = {
    companyName: '',
    legalForm: '',
    industry: '',
    address: '',
    zip: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    vat: '',
    profileImage: '',
  };

  constructor(private router: Router, private customersService: CustomersService) { }

  // Triggered when file input changes
  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
    //console.log('File selected event:', event);
  }

  // Helper to convert Blob to base64 string
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Triggered when cropping is done
  async imageCropped(event: any) {
    //console.log('Full cropped event:', event);

    if (event.base64) {
      this.croppedImage = event.base64;
    } else if (event.blob) {
      this.croppedImage = await this.blobToBase64(event.blob);
    } else {
      //console.warn('No base64 or blob in cropped event!');
      this.croppedImage = null;
    }
    //console.log('croppedImage:', this.croppedImage);
  }

  // Confirm cropped image and reset cropper
  confirmCrop() {
    this.finalImage = this.croppedImage;
    this.imageChangedEvent = '';
    //console.log('finalImage set:', this.finalImage);
  }
  // Back to customers.component
  backToCustomer() {
    this.router.navigate(['/customers']);
  }

  async addCustomer() {
    
    this.customer.profileImage = this.finalImage || '';

    const dbCustomer = {
      company_name: this.customer.companyName,
      legal_form: this.customer.legalForm,
      industry: this.customer.industry,
      address: this.customer.address,
      zip: this.customer.zip,
      city: this.customer.city,
      country: this.customer.country,
      phone: this.customer.phone,
      email: this.customer.email,
      website: this.customer.website,
      vat_number: this.customer.vat,
      image_url: this.customer.profileImage,
    };

    try {
      await this.customersService.addCustomer(dbCustomer);
      alert('Kunde erfolgreich gespeichert ✅');

      this.customer = {
        companyName: '',
        legalForm: '',
        industry: '',
        address: '',
        zip: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        vat: '',
        profileImage: '',
      };
      this.finalImage = null;
    } catch (error) {

      console.error('Fehler beim Speichern:', error);
      alert('❌ Fehler beim Speichern');
    }
  }
}


