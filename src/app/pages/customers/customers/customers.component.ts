import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

 constructor(private router: Router) {}

  openAddCustomers() {
    this.router.navigate(['/customers/add']);
  }

}
