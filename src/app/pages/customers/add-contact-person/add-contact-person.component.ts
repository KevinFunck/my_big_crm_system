import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactPerson } from '@models/contact-person.class';
import { ContactPersonsService } from 'services/contact-persons.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-contact-person',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact-person.component.html',
  styleUrl: './add-contact-person.component.css'
})
export class AddContactPersonComponent {
  // Create a new instance of ContactPerson to bind to the form
  contactPerson: ContactPerson = new ContactPerson();
  constructor(private router: Router, private contactPersonsService: ContactPersonsService, private route: ActivatedRoute) { }

  /**
   * Navigate back to the contact persons list page
   */
  backToContactPersons() {
    this.router.navigate(['/contact/persons']);
  }

  /**
   * Lifecycle hook: Called once after component initialization
   * Reads customerId from query parameters and assigns it to the new contact person
   */
  ngOnInit() {
    // Customer-ID aus QueryParams übernehmen
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    if (customerId) {
      this.contactPerson.customer_id = customerId; // Important: associates new contact with customer
    }
  }

  /**
   * Adds the new contact person to the backend via the service
   * After success, navigates to the customer details page
   */
  async addContactPerson() {
    try {
      // Some ContactPerson instances may have a helper method to transform before saving
      await this.contactPersonsService.addContactPerson(
        this.contactPerson.toDbContactPerson?.() || this.contactPerson
      );
      // Navigate to the customer details page after adding
      this.router.navigate(['/customer/details', this.contactPerson.customer_id]);
    } catch (error) {
      console.error('Fehler beim Speichern der Kontaktperson:', error);
    }
  }
}