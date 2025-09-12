import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from 'services/customers.service';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../../models/customer.class';
import { AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';




@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'

})
export class CustomersComponent {
  customers: Customer[] = []; // Currently displayed customers
  allCustomers: Customer[] = []; // Original full customer list
  groupedCustomers: { [key: string]: Customer[] } = {}; // Grouped by A–Z
  error = '';
  searchTerm = ''; // Value from the search input field
  private scrollToId: string | null = null;

  // Alphabet array for A–Z headers
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');



  constructor(
    private router: Router,
    private customersService: CustomersService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    try {
      // Load customers from service
      const rawCustomers = await this.customersService.getCustomers();
      // Map raw customer objects into Customer class instances
      this.customers = rawCustomers.map((c: any) => new Customer(c));
      // Fetch the full list of customers from the service asynchronously
      // and store it in the 'allCustomers' array for reference and filtering.
      this.allCustomers = [...this.customers];
      // Group them by the first letter of companyName
      this.groupCustomersByAlphabet(this.customers);

      // Scroll to newly added customer group if "scrollTo" param is set
      this.route.queryParams.subscribe(params => {
        const scrollToId = params['scrollToId'];
        console.log('Query Param scrollToId:', scrollToId);
        if (scrollToId) {
          this.scrollToId = scrollToId;
          setTimeout(() => {
            this.scrollToCustomer(scrollToId);
          }, 200);
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.error = 'Error loading customers: ' + err.message;
      } else {
        this.error = 'Unknown error while loading customers.';
      }
      console.error(err);
    }
  }

  // ngAfterViewInit(): void {
  //   console.log('ngAfterViewInit scrollToLetter:', this.scrollToLetter);
  //   if (this.scrollToLetter) {
  //     setTimeout(() => {
  //       this.scrollToCustomer(scrollToId);
  //     }, 300);
  //   }
  // }

  openAddCustomers() {
    this.router.navigate(['/customers/add']);
  }

  // Group customers alphabetically by companyName
  groupCustomersByAlphabet(customers: Customer[]) {
    const grouped: { [key: string]: Customer[] } = {};

    // Initialize empty groups for A-Z
    this.alphabet.forEach(letter => {
      grouped[letter] = [];
    });

    // Place each customer in the appropriate group
    customers.forEach(customer => {
      const firstLetter = customer.companyName?.[0]?.toUpperCase() || '';
      if (grouped[firstLetter]) {
        grouped[firstLetter].push(customer);
      }
    });

    // Sort each group alphabetically by company name
    for (const key in grouped) {
      grouped[key].sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
    }

    this.groupedCustomers = grouped;
  }

  onSearchChange() {
    // Convert the search input to lowercase and remove extra spaces
    const term = this.searchTerm.toLowerCase().trim();
    // Filter the full list of customers (allCustomers) by checking if the company name includes the search term
    const filtered = this.allCustomers.filter(customer =>
      customer.companyName.toLowerCase().includes(term)
    );
    // Update the current customers list with the filtered results
    this.customers = filtered;
    // Regroup the filtered customers alphabetically
    this.groupCustomersByAlphabet(this.customers);
  }

  scrollToCustomer(id: string) {
    setTimeout(() => {
      const element = document.getElementById(`customer-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('animate-glowPop');
        setTimeout(() => {
          element.classList.remove('animate-glowPop');
          
        }, 4500);
      }
    }, 100);
  }
}





