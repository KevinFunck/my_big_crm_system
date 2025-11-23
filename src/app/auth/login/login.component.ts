import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLogin = false;
  splashGone = false; // controls fade-out of splash and fade-in of login

  constructor(private router: Router) {}


  ngOnInit(): void {
    // Show splash for 3 seconds, then fade to login
    setTimeout(() => {
      this.splashGone = true;
    }, 3000); // adjust duration to match glowPop animation
  }


  guest() {
    this.showLogin = false;
    this.router.navigate(['/dashboard']);
  }

}
