import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Booking {

  id: number;

  flat_id: number;
  flat_number: string;
  tower_name: string;
  location: string;
  floor: number;

  user_name: string;
  user_email: string;

  booked_at: string;

  status: string;
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-bookings.component.html',
})
export class AdminBookingsComponent implements OnInit {

  bookings: Booking[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBookings();
  }

  /* ================= AUTH HEADERS ================= */

  private getAuthHeaders() {

    const token = localStorage.getItem('access_token');

    if (!token) {
      alert("Session expired. Please login again.");
      throw new Error("JWT Token missing");
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /* ================= LOAD BOOKINGS ================= */

  loadBookings() {

    this.http.get<Booking[]>(
      `${environment.apiUrl}/admin/bookings`,
      this.getAuthHeaders()
    ).subscribe({

      next: (data) => {
        this.bookings = data;
      },

      error: (err) => {

        console.error("Error loading bookings:", err);

        if (err.status === 401) {
          alert("Unauthorized access");
        }

      }
    });
  }

  /* ================= UPDATE STATUS ================= */

  updateStatus(id: number, status: string) {

    this.http.put(
      `${environment.apiUrl}/admin/booking/${id}`,
      { status },
      this.getAuthHeaders()
    ).subscribe({

      next: () => {

        const booking = this.bookings.find(b => b.id === id);

        if (booking) {
          booking.status = status;
        }

        alert("✅ Booking status updated");
      },

      error: (err) => {

        console.error("Error updating booking:", err);

        if (err.status === 401) {
          alert("Unauthorized!");
        }

      }

    });
  }

}