import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
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
 
   constructor(private router: Router) {}

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
}


