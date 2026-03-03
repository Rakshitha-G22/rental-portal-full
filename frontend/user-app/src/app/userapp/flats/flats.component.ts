import { Component, OnInit } from '@angular/core';
import { FlatService } from '../services/flat.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Flat } from '../services/flat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flats',
  templateUrl: './flats.component.html',
  standalone: true,
  imports:[CommonModule,RouterModule,HttpClientModule,FormsModule]
})
export class FlatsComponent implements OnInit {

  flats: any[] = [];
  loading: boolean = true;
  errorMsg: string = '';
  towers: string[] = [];
  allFlats: any[] = [];
  selectedTower: string = '';
  selectedLocation: string = '';
  selectedPriceRange: string = '';



  locations: string[] = [];
  priceRanges: string[] = ['0-5000', '5000-10000', '10000-20000', '20000+'];

  constructor(private flatService: FlatService) {}

  ngOnInit(): void {
    this.loadFlats();
  }

  loadFlats() {
  this.flatService.getAllFlats().subscribe({
    next: (data: any[]) => {
      console.log("API DATA:", data);  // 👈 add this once for checking

      this.flats = data;
      this.allFlats = data;

 
      this.towers = [...new Set(
        data.map(flat => flat.tower_name)
      )];

     
      this.locations = [...new Set(
        data.map(flat => flat.location)
      )];

      console.log("Locations:", this.locations); 

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = 'Failed to load flats';
      this.loading = false;
    }
  });
}

  filterFlats() {
  this.flats = this.allFlats.filter(flat => {

    // Tower filter
    const towerMatch = this.selectedTower 
      ? flat.tower_name === this.selectedTower 
      : true;

    // Location filter
    const locationMatch = this.selectedLocation
      ? flat.location === this.selectedLocation
      : true;

    // Price filter
    let priceMatch = true;

    if (this.selectedPriceRange) {
      const price = flat.price;

      if (this.selectedPriceRange === '0-5000') {
        priceMatch = price >= 0 && price <= 5000;
      } else if (this.selectedPriceRange === '5000-10000') {
        priceMatch = price > 5000 && price <= 10000;
      } else if (this.selectedPriceRange === '10000-20000') {
        priceMatch = price > 10000 && price <= 20000;
      } else if (this.selectedPriceRange === '20000+') {
        priceMatch = price > 20000;
      }
    }

    return towerMatch && locationMatch && priceMatch;
  });
}
  
}
