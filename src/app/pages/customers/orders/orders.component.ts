import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, } from '@angular/router';
import { Order } from '@models/order.class';
import { OrdersService } from 'services/orders.service';

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
  pendingOrders: Order[] = [];
  inProgressOrders: Order[] = [];
  completedOrders: Order[] = [];
  cancelledOrders: Order[] = []
  pageSize = 10;
  pendingPage = 1;
  inProgressPage = 1;
  completedPage = 1;
  cancelledPage = 1;
  activeOrderTab: 'pending' | 'inprogress' | 'completed' | 'cancelled' = 'pending';

  constructor(private route: ActivatedRoute, private router: Router, private ordersService: OrdersService) { }

  ngOnInit() {
    // 🔥 Customer-ID direkt aus Route holen (z. B. /customers/123/orders)
    this.customerId = this.route.snapshot.paramMap.get('id')!;
    console.log('Customer-ID aus Route:', this.customerId);

    this.pageSize = window.innerWidth < 640 ? 5 : 10;

    if (this.customerId) {
      this.loadOrders();
    }
  }


  private async loadOrders() {
    try {
      const orders = await this.ordersService.getOrdersByCustomerId(this.customerId);

      this.pendingOrders = orders.filter(o => o.status === 'Pending');
      this.inProgressOrders = orders.filter(o => o.status === 'In Progress');
      this.completedOrders = orders.filter(o => o.status === 'Completed');
      this.cancelledOrders = orders.filter(o => o.status === 'Cancelled');

      console.log('Pending Orders:', this.pendingOrders);
      console.log('In Progress Orders:', this.inProgressOrders);
      console.log('Completed Orders:', this.completedOrders);
      console.log('Cancelled Orders:', this.cancelledOrders);
    } catch (error) {
      console.error('Fehler beim Laden der Orders:', error);
    }
  }


  goToAddOrder() {
    if (this.customerId) {
      this.router.navigate([`/customers/${this.customerId}/orders/add`]);
    } else {
      console.error('❌ customerId fehlt!');
    }
  }


  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --------------- GETTERS FOR MAX PAGES ------------------
  get pendingMaxPage(): number {
    return Math.ceil(this.pendingOrders.length / this.pageSize);
  }

  get inProgressMaxPage(): number {
    return Math.ceil(this.inProgressOrders.length / this.pageSize);
  }

  get completedMaxPage(): number {
    return Math.ceil(this.completedOrders.length / this.pageSize);
  }

  get cancelledMaxPage(): number {
    return Math.ceil(this.cancelledOrders.length / this.pageSize);
  }

  // --------------- GETTERS FOR VISIBLE ORDERS PER PAGE ------------------
  getPendingOrdersForPage(): any[] {
    const start = (this.pendingPage - 1) * this.pageSize;
    return this.pendingOrders.slice(start, start + this.pageSize);
  }

  getInProgressOrdersForPage(): any[] {
    const start = (this.inProgressPage - 1) * this.pageSize;
    return this.inProgressOrders.slice(start, start + this.pageSize);
  }

  getCompletedOrdersForPage(): any[] {
    const start = (this.completedPage - 1) * this.pageSize;
    return this.completedOrders.slice(start, start + this.pageSize);
  }

  getCancelledOrdersForPage(): any[] {
    const start = (this.cancelledPage - 1) * this.pageSize;
    return this.cancelledOrders.slice(start, start + this.pageSize);
  }


  setActiveOrderTab(tab: 'pending' | 'inprogress' | 'completed' | 'cancelled') {
    this.activeOrderTab = tab;

    if (tab === 'pending') this.pendingPage = 1;
    if (tab === 'inprogress') this.inProgressPage = 1;
    if (tab === 'completed') this.completedPage = 1;
    if (tab === 'cancelled') this.cancelledPage = 1;
  }

}