import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-bookings.component.html',
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBookings();
  }

  // Helper to get JWT headers
   private getAuthHeaders() {
  const token = localStorage.getItem('access_token');

  if (!token) {
    alert("Session expired. Please login again.");
    throw new Error("Token not found");
  }

  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  };
}

  // Load bookings from backend
  loadBookings() {
    this.http
      .get<any[]>(`${environment.apiUrl}/admin/bookings`, this.getAuthHeaders())
      .subscribe({
        next: (data) => {
          // Map 'confirmed' status from DB to 'Pending' for display
          this.bookings = data.map((b) => ({
            ...b,
            status: b.status === 'confirmed' ? 'Pending' : b.status,
          }));
        },
        error: (err) => {
          console.error('Error loading bookings:', err);
          if (err.status === 401) alert('Unauthorized! Check JWT token.');
        },
      });
  }

  // Update booking status
  updateStatus(id: number, status: string) {
    this.http
      .put(`${environment.apiUrl}/admin/booking/${id}`, { status }, this.getAuthHeaders())
      .subscribe({
        next: () => {
          const b = this.bookings.find((b) => b.id === id);
          if (b) b.status = status;
        },
        error: (err) => {
          console.error('Error updating status:', err);
          if (err.status === 401) alert('Unauthorized! Check JWT token.');
        },
      });
  }
}