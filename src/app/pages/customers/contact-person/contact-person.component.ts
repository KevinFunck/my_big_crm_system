import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactPersonsService } from 'services/contact-persons.service';
import { CustomersService } from 'services/customers.service';
import { CommonModule } from '@angular/common';
import { ContactPerson } from '@models/contact-person.class';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-person',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-person.component.html',
  styleUrl: './contact-person.component.css'
})
export class ContactPersonComponent {
  @Input() customerId!: string; // Input property to receive the current customer ID
  contactPersons: ContactPerson[] = []; // Array to store contact persons
  loading = false; // Flag to indicate loading state
  editingContactId: string | null = null; // Tracks which contact is currently being edited
  editCache: any = {}; // Temporary object to store editable fields during inline editing

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customersService: CustomersService,
    private contactPersonsService: ContactPersonsService
  ) { }

  /**
 * Lifecycle hook: Called once after component initialization
 * Loads contact persons for the given customer
 */
  async ngOnInit() {
    if (!this.customerId) return; // Exit if no customerId is provided

    this.loading = true;
    try {
      // Fetch contact persons from the service
      this.contactPersons =
        await this.contactPersonsService.getContactPersonsByCustomerId(this.customerId);
      console.log('Geladene Kontakte:', this.contactPersons);
    } catch (err) {
      console.error('Fehler beim Laden der Kontakte:', err);
    } finally {
      this.loading = false; // Stop loading indicator
    }
  }

  /**
   * Save inline edits for a contact person
   * Updates the contact person via the service and merges changes
   */
  async saveEdit(contact: ContactPerson) {
    try {
      const updated = await this.contactPersonsService.updateContactPerson(this.editCache);
      Object.assign(contact, updated); // Apply updated fields to the original contact object
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
    } finally {
      this.cancelEdit(); // Reset editing state
    }
  }

  /**
  * Cancel inline editing
  * Clears the editing state and discard changes
  */
  cancelEdit() {
    this.editingContactId = null;
    this.editCache = {};
  }

  /**
   * Delete a contact person
   * Prompts the user for confirmation and removes the contact from the list
   */
  async deleteContactPerson(contact: ContactPerson) {
    if (confirm(`Soll ${contact.contactName} wirklich gelöscht werden?`)) {
      try {
        await this.contactPersonsService.deleteContactPerson(contact.id);
        this.contactPersons = this.contactPersons.filter(c => c.id !== contact.id);
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
      } finally {
        this.cancelEdit(); // Reset editing state after deletion
      }
    }
  }

  /**
   * Start editing a contact person
   * Copies the current contact data to a temporary cache for inline editing
   */
  startEditing(contact: ContactPerson) {
    this.editingContactId = contact.id;
    this.editCache = { ...contact }; // Create a shallow copy for editing
  }

  /**
   * Navigate to the add-contact-person page
   * Passes the customerId as a query parameter
   */
  openAddcontactPerson() {
    if (!this.customerId) {
      console.error('Customer-ID fehlt!');
      return;
    }

    this.router.navigate(['/contact/add'], {
      queryParams: { customerId: this.customerId }
    });
  }
}
