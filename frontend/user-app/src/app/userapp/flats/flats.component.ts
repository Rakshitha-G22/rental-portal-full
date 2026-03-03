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
  allFlats: Flat[] = [];
  selectedTower: string = '';
  location: string = '';

  constructor(private flatService: FlatService) {}

  ngOnInit(): void {
    this.loadFlats();
  }

  loadFlats() {
    this.flatService.getAllFlats().subscribe({
      next: (data: any[]) => {
        this.flats = data;
        this.allFlats = data;
        this.towers = [...new Set(data.map(flat => flat.tower_name))];
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
    if (!this.location) {
      this.flats = this.allFlats;
    } else {
      this.flats = this.allFlats.filter(
        flat => flat.location === this.location
      );
    }

  }
  
}
