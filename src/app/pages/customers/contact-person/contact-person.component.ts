import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactPersonsService } from 'services/contact-persons.service';
import { CustomersService } from 'services/customers.service';
import { CommonModule } from '@angular/common';  
import { ContactPerson } from '@models/contact-person.class';

@Component({
  selector: 'app-contact-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-person.component.html',
  styleUrl: './contact-person.component.css'
})
export class ContactPersonComponent {
  @Input() customerId!: string;
  
  contactPersons: ContactPerson[] = [];   
  loading = false; 

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
