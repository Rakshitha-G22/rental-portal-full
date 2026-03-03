import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../userapp/services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  showAuth = false;
   highlightBooking = false;
    highlightAuth = false; 
    openAuth() { this.showAuth = true; this.highlightAuth = true; setTimeout(() => (this.highlightAuth = false), 1000); }

  flats: any[] = [];
  // highlightBooking = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  // ================= FETCH FLATS =================
  ngOnInit(): void {
    this.api.getFlats().subscribe({
      next: (res: any) => this.flats = res,
      error: (err: any) => console.error(err)
    });
  }

  // ================= BOOKING =================
  book(flat_id: number) {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first!');
      this.router.navigate(['/auth']);
      return;
    }

    this.api.requestBooking(flat_id, token).subscribe({
      next: (res: any) => alert(res.message || 'Booked!'),
      error: (err: any) => alert(err.error?.msg || 'Error requesting booking')
    });
  }

  // ================= SCROLL FUNCTIONS =================
  scrollAndHighlight() {
    const flats = document.getElementById('flats');
    if (flats) flats.scrollIntoView({ behavior: 'smooth' });

    this.highlightBooking = true;
    setTimeout(() => (this.highlightBooking = false), 1000);
  }

  scrollTo(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }
    goToConfirm(id: number) {
    this.router.navigate(['/booking-confirm', id]);
  }
}



