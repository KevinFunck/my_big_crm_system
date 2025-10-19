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
  @Input() customerId!: string;

  contactPersons: ContactPerson[] = [];
  loading = false;
  editingContactId: string | null = null;
  editCache: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customersService: CustomersService,
    private contactPersonsService: ContactPersonsService
  ) { }


  async ngOnInit() {
    if (!this.customerId) return;

    this.loading = true;
    try {
      this.contactPersons =
        await this.contactPersonsService.getContactPersonsByCustomerId(this.customerId);
      console.log('Geladene Kontakte:', this.contactPersons);
    } catch (err) {
      console.error('Fehler beim Laden der Kontakte:', err);
    } finally {
      this.loading = false;
    }
  }


  async saveEdit(contact: ContactPerson) {
    try {
      const updated = await this.contactPersonsService.updateContactPerson(this.editCache);
      Object.assign(contact, updated);
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
    } finally {
      this.cancelEdit();
    }
  }

  
  cancelEdit() {
    this.editingContactId = null;
    this.editCache = {};
  }


  async deleteContactPerson(contact: ContactPerson) {
    if (confirm(`Soll ${contact.contactName} wirklich gelöscht werden?`)) {
      try {
        await this.contactPersonsService.deleteContactPerson(contact.id);
        this.contactPersons = this.contactPersons.filter(c => c.id !== contact.id);
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
      } finally {
        this.cancelEdit();
      }
    }
  }


  startEditing(contact: ContactPerson) {
    this.editingContactId = contact.id;
    this.editCache = { ...contact };
  }


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
