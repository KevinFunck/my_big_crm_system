import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from 'services/customers.service';
import { Customer } from '@models/customer.class';
import { ContactPersonComponent } from "../contact-person/contact-person.component";
import { OrdersComponent } from "../orders/orders.component";
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [FormsModule, CommonModule, ImageCropperComponent, ContactPersonComponent, OrdersComponent, RouterModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
  imageChangedEvent: any = ''; // Holds the file input change event when a new image is selected
  croppedImage: string | null = null; // Stores the base64 string of the cropped image as the user adjusts the cropper
  finalImage: string | null = null; // The final cropped image base64 string after user confirms the crop
  isEditMode = false; // Tracks whether the form is in edit mode
  customer: Customer | null = null; // Holds the original customer data (read-only)
  CustomerObj: Customer = new Customer({}); // Holds the editable customer object for the form
  statusOptions = ['New customer', 'Existing customer']; // Options for the customer's status dropdown
  activeTab: string = 'details';
  isActive: boolean = false;
  @Input() customerId!: string;

  constructor(
    private route: ActivatedRoute,
    private customersService: CustomersService,
    private router: Router
  ) { }

  /**
   * Lifecycle hook: runs on component initialization
   * Fetches customer data by ID and initializes editable object
   */
  async ngOnInit() {
    // Get the customer ID from the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        // Fetch customer data from the service
        const rawCustomer = await this.customersService.getCustomerById(id);
        // Store original data and create editable object
        this.customer = new Customer(rawCustomer);
        this.CustomerObj = new Customer(rawCustomer);
        // If there is an existing profile image, display it
        if (this.CustomerObj.profileImage) {
          this.finalImage = this.CustomerObj.profileImage;
        }
      } catch (err) {
        console.error('Fehler beim Laden des Kunden:', err);
      }
    }
  }

  
  goToContacts() {
    if (this.customer?.id) {
      this.router.navigate(['/customers', this.customer.id, 'contacts']);
    }
  }

  /**
 * Triggered when the user selects a new image file
 */
  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
    //console.log('File selected event:', event);
  }

  /**
 * Triggered when cropping is done
 * Sets finalImage to the cropped result
 */
  confirmCrop() {
    this.finalImage = this.croppedImage;
    this.imageChangedEvent = ''; // Reset cropper input
    //console.log('finalImage set:', this.finalImage);
  }

  /**
 * Helper function to convert Blob to Base64 string
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
 * Supports both base64 and Blob outputs
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
 * Switch to edit mode
 */
  toggleEdit() {
    this.isEditMode = true;
  }

  /**
 * Cancel editing and revert changes
 */
  cancelEdit() {
    this.isEditMode = false;
  }

  /**
 * Save changes to the customer
 * Supports both creating a new customer (if no ID) and updating existing
 */
  async saveChanges() {
    // If there is no customer object, do nothing
    if (!this.CustomerObj) return;

    // Assign the final cropped image (if any) to the customer object
    this.CustomerObj.profileImage = this.finalImage || '';

    // Convert the customer object to the format expected by the database
    const dbCustomer = this.CustomerObj.toDbCustomer();

    // Check if the customer has an ID
    // If not, this is a new customer → use INSERT
    if (!this.CustomerObj.id) {
      try {
        // Call the service to add the new customer to the database
        const newCustomer = await this.customersService.addCustomer(dbCustomer);

        // Notify the user that the customer was created successfully
        alert('Customer successfully created ✅');

        // Update the local customer object with the data returned from the database
        // Supabase returns an array for inserts, so take the first element
        this.CustomerObj = new Customer(newCustomer[0]);

        // Exit edit mode
        this.isEditMode = false;
      } catch (err: any) {
        // Log any errors to the console and alert the user
        console.error('Error creating customer:', err);
        alert('❌ Error creating customer. Check console for details.');
      }
      return; // Exit the function after insert
    }

    // If the customer has an ID, it's an existing customer → use UPDATE
    try {
      // Merge the dbCustomer object with the id and call the update service
      const updatedCustomer = await this.customersService.updateCustomer({
        ...dbCustomer,
        id: this.CustomerObj.id
      } as any);

      // Notify the user that the update was successful
      alert('Customer successfully updated ✅');

      // Update the local customer object with the returned data
      this.CustomerObj = new Customer(updatedCustomer);

      // Exit edit mode
      this.isEditMode = false;
    } catch (err: any) {
      // Log any errors and alert the user
      console.error('Error updating customer:', err);
      alert('❌ Error updating customer. Check console for details.');
    }
  }
}
