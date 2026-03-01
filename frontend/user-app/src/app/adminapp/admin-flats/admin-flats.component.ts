import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tower {
  id: number;
  name: string;
}

interface Flat {
  id?: number;
  tower_name: string;
  title: string;
  location: string;
  floor: number | null;
  price: number | null;
  image: string;
  amenities: string;
}

@Component({
  selector: 'app-admin-flats',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-flats.component.html',
})
export class AdminFlatsComponent implements OnInit {

  towers: Tower[] = [];
  flats: Flat[] = [];

  editingFlatId: number | null = null;   

  newFlat: Flat = this.resetFlat();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTowers();
    this.loadFlats();
  }

  resetFlat(): Flat {
    return {
      tower_name: '',
      title: '',
      location: '',
      floor: 0,
      price: 0,
      image: '',
      amenities: ''
    };
  }

  loadTowers() {
    this.http.get<Tower[]>('http://localhost:5000/api/towers')
      .subscribe(data => this.towers = data);
  }

  loadFlats() {
    const token = localStorage.getItem('token');

    this.http.get<Flat[]>(
      'http://localhost:5000/api/admin/flats',
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(data => this.flats = data);
  }

  addFlat() {
    const token = localStorage.getItem('token');

    if (this.editingFlatId) {
      this.updateFlat();   
      return;
    }

    this.http.post(
      'http://localhost:5000/api/admin/flat',
      this.newFlat,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(() => {
      alert('🎉 Flat added successfully!');
      this.loadFlats();
      this.newFlat = this.resetFlat();
    });
  }

  editFlat(flat: Flat) {
    this.editingFlatId = flat.id!;
    this.newFlat = { ...flat };   
  }

  updateFlat() {
    const token = localStorage.getItem('token');

    this.http.put(
      `http://localhost:5000/api/admin/flat/${this.editingFlatId}`,
      this.newFlat,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(() => {
      alert('✏️ Flat updated successfully!');
      this.loadFlats();
      this.cancelEdit();
    });
  }

  cancelEdit() {
    this.editingFlatId = null;
    this.newFlat = this.resetFlat();
  }

  deleteFlat(index: number) {
    this.flats.splice(index, 1);
  }
}