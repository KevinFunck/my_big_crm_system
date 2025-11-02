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
  activeTab: 'details' | 'contacts' | 'orders' = 'contacts'; // Tracks which main tab is active (Details, Contacts, Orders)
  customerId: string = ''; // Holds the current customer ID from the route
  pendingOrders: Order[] = []; // Arrays for storing orders by status
  inProgressOrders: Order[] = []; // Arrays for storing orders by status
  completedOrders: Order[] = []; // Arrays for storing orders by status
  cancelledOrders: Order[] = [] // Arrays for storing orders by status
  // Pagination settings
  pageSize = 10;
  pendingPage = 1;
  inProgressPage = 1;
  completedPage = 1;
  cancelledPage = 1;
  // Tracks which order status tab is currently active
  activeOrderTab: 'pending' | 'inprogress' | 'completed' | 'cancelled' = 'pending';

  constructor(private route: ActivatedRoute, private router: Router, private ordersService: OrdersService) { }

  ngOnInit() {
    // 🔥 Customer-ID direkt aus Route holen (z. B. /customers/123/orders)
    this.customerId = this.route.snapshot.paramMap.get('id')!;
    console.log('Customer-ID aus Route:', this.customerId);

    // Adjust page size for smaller screens
    this.pageSize = window.innerWidth < 640 ? 5 : 10;

    // Load orders if customer ID is available
    if (this.customerId) {
      this.loadOrders();
    }
  }

  /**
  * Fetches all orders for the current customer
  * and separates them into different status arrays.
  */
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

  /**
 * Navigate to the "Add Order" page for the current customer
 */
  goToAddOrder() {
    if (this.customerId) {
      this.router.navigate([`/customers/${this.customerId}/orders/add`]);
    } else {
      console.error('❌ customerId fehlt!');
    }
  }


  // scrollToSection(sectionId: string) {
  //   const el = document.getElementById(sectionId);
  //   if (el) {
  //     el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // }

  // --------------- GETTERS FOR MAX PAGES ------------------

  /** Calculate max page for pending orders */
  get pendingMaxPage(): number {
    return Math.ceil(this.pendingOrders.length / this.pageSize);
  }

  /** Calculate max page for in-progress orders */
  get inProgressMaxPage(): number {
    return Math.ceil(this.inProgressOrders.length / this.pageSize);
  }

  /** Calculate max page for completed orders */
  get completedMaxPage(): number {
    return Math.ceil(this.completedOrders.length / this.pageSize);
  }

  /** Calculate max page for cancelled orders */
  get cancelledMaxPage(): number {
    return Math.ceil(this.cancelledOrders.length / this.pageSize);
  }

  // --------------- GETTERS FOR VISIBLE ORDERS PER PAGE ------------------

  /** Returns the pending orders for the current page */
  getPendingOrdersForPage(): any[] {
    const start = (this.pendingPage - 1) * this.pageSize;
    return this.pendingOrders.slice(start, start + this.pageSize);
  }

  /** Returns the in-progress orders for the current page */
  getInProgressOrdersForPage(): any[] {
    const start = (this.inProgressPage - 1) * this.pageSize;
    return this.inProgressOrders.slice(start, start + this.pageSize);
  }

  /** Returns the completed orders for the current page */
  getCompletedOrdersForPage(): any[] {
    const start = (this.completedPage - 1) * this.pageSize;
    return this.completedOrders.slice(start, start + this.pageSize);
  }

  /** Returns the cancelled orders for the current page */
  getCancelledOrdersForPage(): any[] {
    const start = (this.cancelledPage - 1) * this.pageSize;
    return this.cancelledOrders.slice(start, start + this.pageSize);
  }

  /**
   * Set the active order status tab (pending, inprogress, completed, cancelled)
   * and reset the page number for that tab to 1
   */
  setActiveOrderTab(tab: 'pending' | 'inprogress' | 'completed' | 'cancelled') {
    this.activeOrderTab = tab;

    if (tab === 'pending') this.pendingPage = 1;
    if (tab === 'inprogress') this.inProgressPage = 1;
    if (tab === 'completed') this.completedPage = 1;
    if (tab === 'cancelled') this.cancelledPage = 1;
  }

}