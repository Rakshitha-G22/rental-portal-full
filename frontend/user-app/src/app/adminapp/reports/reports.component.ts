import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface ApprovedBooking {
  user_name: string;
  flat_number: string;
  flat_type: string;
  location: string;
}

interface ReportsResponse {
  approved: number;
  declined: number;
  Cancelled: number;
  approved_bookings: ApprovedBooking[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {

  approved = 0;
  declined = 0;
  Cancelled = 0;

  approvedBookings: ApprovedBooking[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReports();
  }

  /* ================= AUTH HEADERS ================= */

  private getAuthHeaders() {

    const token = localStorage.getItem('access_token');

    if (!token) {
      alert("Session expired. Please login again.");
      throw new Error("JWT token missing");
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /* ================= LOAD REPORTS ================= */

  loadReports() {

    this.http.get<ReportsResponse>(
      `${environment.apiUrl}/admin/reports`,
      this.getAuthHeaders()
    ).subscribe({

      next: (res) => {

        this.approved = res.approved;
        this.declined = res.declined;
        this.Cancelled = res.Cancelled;

        this.approvedBookings = res.approved_bookings;
      },

      error: (err) => {
        console.error("Reports error:", err);

        if (err.status === 401) {
          alert("Unauthorized access");
        }
      }

    });

  }

}