import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactPerson } from '@models/contact-person.class';
import { OrdersService } from 'services/orders.service';
import { ContactPersonsService } from 'services/contact-persons.service';
import { Order } from '@models/order.class';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  order: Order = new Order();             // The Order object that will be displayed/edited
  contactPersons: ContactPerson[] = [];  // List of possible contact persons for dropdown
  isEditMode: boolean = false;           // Controls whether fields are editable or read-only
  customerId: string = '';               // Customer ID extracted from the route
  orderId: string = '';                  // Order ID extracted from the route


  constructor(
    private route: ActivatedRoute,                 // To access route parameters (customer ID, order ID)
    private router: Router,                        // To navigate programmatically
    private ordersService: OrdersService,         // Service to fetch/update order data
    private contactPersonsService: ContactPersonsService // Service to fetch contact persons
  ) { }


  // --------------------- Lifecycle Hook ---------------------
  async ngOnInit() {
    // Retrieve customer ID and order ID from the URL
    this.customerId = this.route.snapshot.paramMap.get('id') || '';
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

    // Check if required IDs exist
    if (!this.customerId || !this.orderId) {
      console.error('Customer ID or Order ID is missing!');
      return;
    }

    try {
      // Load the list of contact persons for the customer (for dropdown)
      this.contactPersons = await this.contactPersonsService.getContactPersonsByCustomerId(this.customerId);

      // Load the details of the selected order
      this.order = await this.ordersService.getOrderById(this.orderId);
      console.log('Loaded Order:', this.order);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }


  // --------------------- Edit / Save / Cancel ---------------------

  // Switch to edit mode to allow modifying fields
  toggleEdit() {
    this.isEditMode = true;
  }

  // Save changes made to the order
  async saveChanges() {
    try {
      // Update the order using the OrdersService
      await this.ordersService.updateOrder(this.order.id, this.order);
      this.isEditMode = false; // Exit edit mode
      alert('Order saved successfully!');
    } catch (error) {
      console.error('Error saving the order:', error);
      alert('Error saving the order. Check the console for details.');
    }
  }

  // Cancel editing and discard changes
  cancelEdit() {
    this.isEditMode = false; // Exit edit mode
    // Reload the original data from the server to restore the state
    this.ngOnInit();
  }


  // --------------------- Navigation ---------------------

  // Navigate back to the orders list for the current customer
  goBack() {
    this.router.navigate([`/customers/${this.customerId}/orders`]);
  }
}

