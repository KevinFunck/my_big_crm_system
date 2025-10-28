import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  activeTab: 'details' | 'contacts' | 'orders' = 'contacts';
  customerId: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // 🔥 Customer-ID direkt aus Route holen (z. B. /customers/123/orders)
    this.customerId = this.route.snapshot.paramMap.get('id')!;
    console.log('Customer-ID aus Route:', this.customerId);
  }

  goToAddOrder() {
    if (this.customerId) {
      this.router.navigate([`/customers/${this.customerId}/orders/add`]);
    } else {
      console.error('❌ customerId fehlt!');
    }
  }
}
