import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FlatService } from '../services/flat.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookingService } from '../services/booking.service';


@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule]
})
export class BookingConfirmComponent implements OnInit {

  flat: any = null;
  loading: boolean = true;
  errorMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flatService: FlatService,
    private bookingService: BookingService,
  ) {}

 ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  console.log('Flat ID:', idParam);

  if (!idParam) {
    this.errorMsg = "Invalid flat ID";
    this.loading = false;
    return;
  }

  const id = Number(idParam);  

  if (isNaN(id)) {
    this.errorMsg = "Flat ID is not valid";
    this.loading = false;
    return;
  }

  this.flatService.getFlatById(id).subscribe({
    next: (data) => {
      console.log('Flat data:', data);
      this.flat = data;
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = "Failed to load flat details";
      this.loading = false;
    }
  });
}



  confirmBooking() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Please login first");
    return;
  }

  if (!this.flat) {
    alert("Flat details missing");
    return;
  }

  this.bookingService.createBooking(this.flat.id, token).subscribe({
    next: (res: any) => {
      alert("Booking Confirmed Successfully!");
      this.router.navigate(['/my-bookings']);
    },
    error: (err: any) => {
      console.error("Booking failed:", err);
      alert("Booking failed. Try again.");
    }
  });
}

}
