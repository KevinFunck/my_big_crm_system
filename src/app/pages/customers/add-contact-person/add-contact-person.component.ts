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
  contactPerson: ContactPerson = new ContactPerson();
  constructor(private router: Router, private contactPersonsService: ContactPersonsService, private route: ActivatedRoute) { }


  backToContactPersons() {
    this.router.navigate(['/contact/persons']);
  }

  ngOnInit() {
    // Customer-ID aus QueryParams übernehmen
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    if (customerId) {
      this.contactPerson.customer_id = customerId;  // ⚡ WICHTIG!
    }
  }


  async addContactPerson() {
    try {
      await this.contactPersonsService.addContactPerson(
        this.contactPerson.toDbContactPerson?.() || this.contactPerson
      );
      this.router.navigate(['/customer/details', this.contactPerson.customer_id]);
    } catch (error) {
      console.error('Fehler beim Speichern der Kontaktperson:', error);
    }
  }
}