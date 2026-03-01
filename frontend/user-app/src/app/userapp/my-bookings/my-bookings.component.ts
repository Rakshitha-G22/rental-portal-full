import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  standalone: true,
  imports: [CommonModule,RouterModule]
})
export class MyBookingsComponent implements OnInit {

  bookings: any[] = [];
  loading = true;
  msg = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.msg = "Please login first";
      this.loading = false;
      return;
    }

    this.bookingService.getMyBookings(token).subscribe({
      next: (res: any) => {
        this.bookings = res.bookings;
        if (this.bookings.length === 0) {
          this.msg = "No bookings found.";
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.msg = "Failed to load bookings.";
        this.loading = false;
      }
    });
  }

  cancel(booking: any) {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!confirm("Are you sure you want to cancel this booking?")) return;

    this.bookingService.cancelBooking(booking.id, token).subscribe({
      next: () => {
        booking.status = "Cancelled";
      },
      error: (err: any) => {
        console.error(err);
        alert("Cancellation failed.");
      }
    });
  }

  downloadPDF(id: number) {

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Please login first");
    return;
  }

  this.bookingService.downloadReceipt(id, token).subscribe({
    next: (blob: Blob) => {

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Booking_Receipt_${id}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    },
    error: (err: any) => {
      console.error(err);
      alert("Receipt download failed");
    }
  });
}

}
