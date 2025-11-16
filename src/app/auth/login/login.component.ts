import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  splashGone = false; // controls fade-out of splash and fade-in of login

  ngOnInit(): void {
    // Show splash for 3 seconds, then fade to login
    setTimeout(() => {
      this.splashGone = true;
    }, 3000); // adjust duration to match glowPop animation
  }

}
