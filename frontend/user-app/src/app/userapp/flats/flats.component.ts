import { Component, OnInit } from '@angular/core';
import { FlatService } from '../services/flat.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flats',
  templateUrl: './flats.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule]
})
export class FlatsComponent implements OnInit {

  flats: any[] = [];
  allFlats: any[] = [];

  loading: boolean = true;
  errorMsg: string = '';

  towers: string[] = [];
  locations: string[] = [];

  selectedTower: string = '';
  selectedLocation: string = '';
  selectedPriceRange: string = '';

  isLoggedIn = false;

  priceRanges: string[] = [
    '0-5000',
    '5000-10000',
    '10000-20000',
    '20000+'
  ];

  constructor(
    private flatService: FlatService,
    private router: Router
  ) {}

  // ⭐ Load Flats

ngOnInit(): void {
  this.loadFlats();

  const token = localStorage.getItem('access_token');
  this.isLoggedIn = !!token;
}
  // ⭐ Load Flats From API
  loadFlats() {

    this.flatService.getAllFlats().subscribe({

      next: (data: any[]) => {

        this.flats = data;
        this.allFlats = data;

        this.towers = [...new Set(data.map(f => f.tower_name))];
        this.locations = [...new Set(data.map(f => f.location))];

        this.loading = false;
      },

      error: () => {
        this.errorMsg = "Failed to load flats";
        this.loading = false;
      }

    });

  }


bookNow(flatId: number) {

  const confirmBooking = confirm("Do you want to book this flat?");

  if (!confirmBooking) {
    return; // user clicked Cancel
  }

  const token = localStorage.getItem('access_token');

  if (!token) {
    alert("Please login to book flat");

    this.router.navigate(['/auth'], {
      queryParams: { returnUrl: `/booking-confirm/${flatId}` }
    });

    return;
  }

  // If logged in → go normally
  this.router.navigate(['/booking-confirm', flatId]);
}

  // ⭐ Filter Flats
  filterFlats() {

    this.flats = this.allFlats.filter(flat => {

      const towerMatch = this.selectedTower
        ? flat.tower_name === this.selectedTower
        : true;

      const locationMatch = this.selectedLocation
        ? flat.location === this.selectedLocation
        : true;

      let priceMatch = true;

      if (this.selectedPriceRange) {

        const price = flat.price;

        if (this.selectedPriceRange === '0-5000')
          priceMatch = price >= 0 && price <= 5000;

        else if (this.selectedPriceRange === '5000-10000')
          priceMatch = price > 5000 && price <= 10000;

        else if (this.selectedPriceRange === '10000-20000')
          priceMatch = price > 10000 && price <= 20000;

        else if (this.selectedPriceRange === '20000+')
          priceMatch = price > 20000;
      }

      return towerMatch && locationMatch && priceMatch;

    });

  }

}