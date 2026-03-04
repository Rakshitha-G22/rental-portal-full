import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FlatService } from '../services/flat.service';
import { BookingService } from '../services/booking.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-booking-confirm',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './booking-confirm.component.html'
})
export class BookingConfirmComponent implements OnInit {

  flat: any = null;
  loading = true;
  errorMsg = '';

  userId: any;
  userEmail: any;
  userName: any;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flatService: FlatService,
    private bookingService: BookingService
  ) {}

  // ================= LOAD FLAT DETAILS =================
  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || isNaN(Number(idParam))) {
      this.errorMsg = "Invalid Flat ID";
      this.loading = false;
      return;
    }

    this.loadUserFromToken();

    const id = Number(idParam);

    this.flatService.getFlatById(id).subscribe({
      next: (data: any) => {
        this.flat = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = "Failed to load flat details";
        this.loading = false;
      }
    });
  }

  // ================= LOAD USER FROM TOKEN =================
  loadUserFromToken() {

    const token = localStorage.getItem('access_token');

    if (!token) {
      this.isLoggedIn = false;
      return;
    }

    try {
      const cleanToken = token.replace('Bearer ', '');
      const decoded: any = jwtDecode(cleanToken);

      this.userId = decoded.user_id || decoded.id || decoded.sub;
      this.userName = decoded.name;
      this.userEmail = decoded.email;

      this.isLoggedIn = true;

    } catch (err) {
      console.error("Token Decode Error", err);
      this.isLoggedIn = false;
    }
  }

  // ================= CONFIRM BOOKING =================
  confirmBooking() {

    if (!this.isLoggedIn) {

      alert("Please login to book flat");

      this.router.navigate(['/auth'], {
        queryParams: { returnUrl: this.router.url }
      });

      return;
    }

    if (!this.flat) {
      alert("Flat data missing");
      return;
    }

    const token = localStorage.getItem('access_token');
    const cleanToken = token?.replace('Bearer ', '');

    const bookingPayload = {
      flat_id: this.flat.id
    };

    this.bookingService.createBooking(
      bookingPayload,
      cleanToken!
    ).subscribe({

      next: () => {
        alert("Booking Confirmed Successfully!");

        // 🔥 Update UI instantly
        this.flat.is_booked = true;
      },

      error: (err) => {

        console.error(err);

        if (err.status === 401) {
          alert("Session expired. Please login again");
          localStorage.removeItem('access_token');
          this.router.navigate(['/auth']);
        }
        else {
          alert(err.error?.msg || "Booking failed. Try again.");
        }

      }

    });
  }

}