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
  customerId: string = '';
  selectedPriority: string = '';
  selectedStaus: string = '';
  selectedContactId: string = '';
  contactPersons: ContactPerson[] = [];
  order: Order = new Order();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contactPersonsService: ContactPersonsService,
    private ordersService: OrdersService
  ) { }


  async ngOnInit() {
    // customerId aus der URL holen (z. B. /customers/123/orders/add)
    this.customerId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Customer-ID:', this.customerId);

    if (!this.customerId) return;

    try {
      // Kontakte für diesen Customer laden
      this.contactPersons = await this.contactPersonsService.getContactPersonsByCustomerId(this.customerId);
      console.log('Geladene Kontaktpersonen:', this.contactPersons);
    } catch (err) {
      console.error('Fehler beim Laden der Kontaktpersonen:', err);
    }
  }
  async addOrder() {
    if (!this.customerId) {
      alert('Customer-ID fehlt!');
      return;
    }

    this.order.customer_id = this.customerId;

    try {
      await this.ordersService.addOrder(this.order.toDbOrder?.() || this.order);
      this.router.navigate([`/customers/${this.customerId}/orders`]);
    } catch (error: any) {
      console.error('Fehler beim Speichern des Auftrags:', error);
      alert(`❌ Fehler beim Speichern des Auftrags:\n${error.message || JSON.stringify(error)}`);
    }
  }
}
