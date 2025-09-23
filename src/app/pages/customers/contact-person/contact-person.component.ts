import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-person',
  standalone: true,
  imports: [],
  templateUrl: './contact-person.component.html',
  styleUrl: './contact-person.component.css'
})
export class ContactPersonComponent {

    constructor(
      private router: Router,
      private route: ActivatedRoute
    ) { }

    
  openAddcontactPerson() {
    this.router.navigate(['/contact/add']);
  }
}
