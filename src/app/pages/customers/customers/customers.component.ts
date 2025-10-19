import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from 'services/customers.service';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../../models/customer.class';





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
  error = ''; // Holds error messages during data loading
  searchTerm = ''; // Value from the search input field
  private scrollToId: string | null = null; // Used for scrolling to a specific customer after adding

  // Alphabet array for A–Z headers
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');


  constructor(
    private router: Router,
    private customersService: CustomersService,
    private route: ActivatedRoute
  ) { }

  /**
 * Lifecycle hook: load customers on component init
 */
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

  /**
   * Navigate to the add-customer page
   */
  openAddCustomers() {
    this.router.navigate(['/customers/add']);
  }

  /**
 * Group a list of customers alphabetically by the first letter of companyName
 */
  groupCustomersByAlphabet(customers: Customer[]) {
    const grouped: { [key: string]: Customer[] } = {};

    // Initialize empty groups for A-Z
    this.alphabet.forEach(letter => {
      grouped[letter] = [];
    });

    // Assign each customer to the corresponding letter group
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

  /**
 * Called whenever the search input changes
 * Filters the customers list and re-groups them alphabetically
 */
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

  /**
 * Scrolls smoothly to a specific customer element and highlights it temporarily
 */
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

  /**
 * Navigate to customer details page for the selected customer
 */
  openCustomerDetails(customer: Customer) {
    this.router.navigate(['/customers/details', customer.id]);
  }
}





