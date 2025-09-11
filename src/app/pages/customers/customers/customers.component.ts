import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from 'services/customers.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers: any[] = []; // Currently displayed customers
  allCustomers: any[] = []; // Original full customer list
  groupedCustomers: { [key: string]: any[] } = {};// Grouped by A–Z
  error = '';
  searchTerm = ''; // Value from the search input field

  // Alphabet array for A–Z headers
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private router: Router, private customersService: CustomersService) { }

  async ngOnInit() {
    try {
      // Load customers from service
      this.customers = await this.customersService.getCustomers();
      // Fetch the full list of customers from the service asynchronously
      // and store it in the 'allCustomers' array for reference and filtering.
      this.allCustomers = await this.customersService.getCustomers();
      // Group them by the first letter of company_name
      this.groupCustomersByAlphabet(this.customers);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.error = 'Error loading customers: ' + err.message;
      } else {
        this.error = 'Unknown error while loading customers.';
      }
      console.error(err);
    }
  }

  openAddCustomers() {
    this.router.navigate(['/customers/add']);
  }


  // Group customers alphabetically by company_name
  groupCustomersByAlphabet(customers: any[]) {
    const grouped: { [key: string]: any[] } = {};

    // Initialize empty groups for A-Z
    this.alphabet.forEach(letter => {
      grouped[letter] = [];
    });

    // Place each customer in the appropriate group
    customers.forEach(customer => {
      const firstLetter = customer.company_name?.[0]?.toUpperCase() || '';
      if (grouped[firstLetter]) {
        grouped[firstLetter].push(customer);
      }
    });

    // Sort each group alphabetically by company name
    for (const key in grouped) {
      grouped[key].sort((a, b) =>
        a.company_name.localeCompare(b.company_name)
      );
    }

    this.groupedCustomers = grouped;
  }

  onSearchChange() {
    // Convert the search input to lowercase and remove extra spaces
    const term = this.searchTerm.toLowerCase().trim();
    // Filter the full list of customers (allCustomers) by checking if the company name includes the search term
    const filtered = this.allCustomers.filter(customer =>
      customer.company_name.toLowerCase().includes(term)
    );
    // Update the current customers list with the filtered results
    this.customers = filtered;
    // Regroup the filtered customers alphabetically
    this.groupCustomersByAlphabet(this.customers);
  }
}




