import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

  constructor(private router: Router) {}

  user = {
    name: localStorage.getItem('username'),
    email: localStorage.getItem('email') || 'Not Available'
  };

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  downloadBookings() {
    this.router.navigate(['/my-bookings']);
  }
}
