import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { Router } from '@angular/router';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '../../../models/customer.class';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, FormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  imageChangedEvent: any = ''; // Holds the file input change event when a new image is selected
  croppedImage: string | null = null; // Stores the base64 string of the cropped image as the user adjusts the cropper
  finalImage: string | null = null; // The final cropped image base64 string after user confirms the crop
  customer: Customer = new Customer(); // Initialize a new Customer object to hold the form data for the new customer


  constructor(private router: Router, private customersService: CustomersService) { }

  ngOnInit() {
    // When the component initializes, set the default status of the new customer
    // to "New customer" so that it appears in the form input automatically.
    this.customer.status = 'New customer';
  }

  // Triggered when file input changes
  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
    //console.log('File selected event:', event);
  }

  /**
 * Helper function: converts a Blob to a base64 string
 */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
 * Triggered when the cropper emits a cropped image event
 * Supports both base64 and Blob outputs from the cropper
 */
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

  /**
 * Confirms the cropped image and resets the cropper
 * Final image is stored in `finalImage` for submission
 */
  confirmCrop() {
    this.finalImage = this.croppedImage;
    this.imageChangedEvent = '';
    //console.log('finalImage set:', this.finalImage);
  }

  /**
  * Navigate back to the customer list
  */
  backToCustomer() {
    this.router.navigate(['/customers']);
  }

  /**
   * Adds a new customer using the service
   * Includes the final cropped profile image
   * After success, navigates back to customers list and scrolls to the new customer
   */
  async addCustomer() {
    this.customer.profileImage = this.finalImage || '';
    try {
      const data = await this.customersService.addCustomer(this.customer.toDbCustomer());
      if (data && data.length > 0) {
        const newCustomer = data[0];
        alert('Kunde erfolgreich gespeichert ');
        // Reset form for next customer
        this.customer = new Customer();
        this.finalImage = null;
        // Navigate back to the customer list with optional scroll to new customer
        this.router.navigate(['/customers'], { queryParams: { scrollToId: newCustomer.id } });
      } else {
        alert('❌ Fehler: Keine Kundendaten zurückgegeben.');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('❌ Fehler beim Speichern');
    }
  }

}


