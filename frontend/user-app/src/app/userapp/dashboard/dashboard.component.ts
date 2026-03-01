// src/app/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsComponent } from 'app/bookings/bookings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BookingsComponent],
  template: `
  <div class="min-h-screen flex flex-col items-center bg-gray-100 p-5">
    <div class="bg-white p-10 rounded-xl shadow-lg text-center w-full max-w-2xl">
      <h1 class="text-4xl font-bold mb-4">Welcome, {{ username }}!</h1>
      <p class="text-lg mb-6">This is your dashboard.</p>
      <button (click)="logout()" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 mb-6">
        Logout
      </button>
    </div>

    <!-- Bookings -->
    <app-bookings></app-bookings>
  </div>
  `
})
export class DashboardComponent {
  username: string = '';

  constructor(private router: Router) {
    this.username = localStorage.getItem('username') || 'User';
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']); // back to login/home
  }
}
