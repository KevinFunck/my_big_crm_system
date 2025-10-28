import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./pages/customers/customers/customers.component')
        .then(m => m.CustomersComponent)
  },
  {
    path: 'customers/add',
    loadComponent: () =>
      import('./pages/customers/add-customer/add-customer.component')
        .then(m => m.AddCustomerComponent)
  },
  {
    path: 'customers/details/:id',
    loadComponent: () =>
      import('./pages/customers/customer-details/customer-details.component')
        .then(m => m.CustomerDetailsComponent)
  },
  {
    path: 'customers/:id/contacts',
    loadComponent: () =>
      import('./pages/customers/contact-person/contact-person.component')
        .then(m => m.ContactPersonComponent)
  },
  {
    path: 'customers/:id/contacts/add',
    loadComponent: () =>
      import('./pages/customers/add-contact-person/add-contact-person.component')
        .then(m => m.AddContactPersonComponent)
  },
  {
    path: 'customers/:id/orders',
    loadComponent: () =>
      import('./pages/customers/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'customers/:id/orders/add',
    loadComponent: () =>
      import('./pages/customers/add-order/add-order.component')
        .then(m => m.AddOrderComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];