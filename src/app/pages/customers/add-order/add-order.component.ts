import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactPersonsService } from 'services/contact-persons.service';
import { ContactPerson } from '@models/contact-person.class';
import { OrdersService } from 'services/orders.service';
import { Order } from '@models/order.class';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent {
  customerId: string = ''; // Holds the current customer ID from the route
  selectedPriority: string = ''; // Selected values for form inputs
  selectedStaus: string = ''; // Selected values for form inputs
  selectedContactId: string = ''; // Selected values for form inputs
  contactPersons: ContactPerson[] = []; // Array to store contact persons for the current customer
  order: Order = new Order(); // The order object being created

  constructor(
    private router: Router, // For navigation
    private route: ActivatedRoute, // To read route parameters
    private contactPersonsService: ContactPersonsService, // Service to fetch contact persons
    private ordersService: OrdersService // Service to create new orders
  ) { }


  async ngOnInit() {
    // Get customer ID from the route, e.g., /customers/123/orders/add
    this.customerId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Customer-ID:', this.customerId);

    // If no customer ID is present, do nothing
    if (!this.customerId) return;

    try {
      // Load contact persons for this customer
      this.contactPersons = await this.contactPersonsService.getContactPersonsByCustomerId(this.customerId);
      console.log('Geladene Kontaktpersonen:', this.contactPersons);
    } catch (err) {
      console.error('Fehler beim Laden der Kontaktpersonen:', err);
    }
  }

  /**
 * Add a new order for the current customer
 */
  async addOrder() {
    if (!this.customerId) {
      // Ensure customer ID exists before saving
      alert('Customer-ID fehlt!');
      return;
    }
    // Assign customer ID to the new order
    this.order.customer_id = this.customerId;

    try {
      // Save the order using the OrdersService
      // Use toDbOrder() if defined to map the order object for the database
      await this.ordersService.addOrder(this.order.toDbOrder?.() || this.order);
      // Navigate back to the orders list for this customer
      this.router.navigate([`/customers/${this.customerId}/orders`]);
    } catch (error: any) {
      console.error('Fehler beim Speichern des Auftrags:', error);
      alert(`❌ Fehler beim Speichern des Auftrags:\n${error.message || JSON.stringify(error)}`);
    }
  }
}
