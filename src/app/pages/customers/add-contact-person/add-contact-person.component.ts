import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact-person',
  standalone: true,
  imports: [],
  templateUrl: './add-contact-person.component.html',
  styleUrl: './add-contact-person.component.css'
})
export class AddContactPersonComponent {

  constructor(private router:Router) {}

  

  backToContactPersons() {
      this.router.navigate(['/customers/details/']);
  }

}
