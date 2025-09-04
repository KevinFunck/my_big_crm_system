import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
   {
    path: 'customers',
    loadComponent: () =>
      import('./pages/customers/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
