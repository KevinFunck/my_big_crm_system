import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from 'services/customers.service';
import { Customer } from '@models/customer.class';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [FormsModule, CommonModule, ImageCropperComponent],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
  imageChangedEvent: any = ''; // Holds the file input change event when a new image is selected
  croppedImage: string | null = null; // Stores the base64 string of the cropped image as the user adjusts the cropper
  finalImage: string | null = null; // The final cropped image base64 string after user confirms the crop
  isEditMode = false;
  customer: Customer | null = null;
  CustomerObj: Customer = new Customer({});


  constructor(
    private route: ActivatedRoute,
    private customersService: CustomersService
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const rawCustomer = await this.customersService.getCustomerById(id);
        this.customer = new Customer(rawCustomer);
        this.CustomerObj = new Customer(rawCustomer);

        if (this.CustomerObj.profileImage) {
          this.finalImage = this.CustomerObj.profileImage;
        }
      } catch (err) {
        console.error('Fehler beim Laden des Kunden:', err);
      }
    }
  }


  // Triggered when file input changes
  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
    //console.log('File selected event:', event);
  }

  // Confirm cropped image and reset cropper
  confirmCrop() {
    this.finalImage = this.croppedImage;
    this.imageChangedEvent = '';
    //console.log('finalImage set:', this.finalImage);
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

  toggleEdit() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    console.log('Abgebrochen');
  }

  saveChanges() {

  }


}
