import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { FlatService } from 'app/userapp/services/flat.service';

interface Tower {
  id: number;
  name: string;
}

interface Flat {
  id?: number;
  flat_number: string;
  flat_type: string;
  tower_name: string;
  location: string;
  floor: number | null;
  price: number | null;
  image: string;
  amenities: string[];
  is_booked?: boolean;

}

@Component({
  selector: 'app-admin-flats',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-flats.component.html'
})
export class AdminFlatsComponent implements OnInit {

  towers: Tower[] = [];
  flats: Flat[] = [];

  editingFlatId: number | null = null;

  // amenitiesText = '';
  amenitiesText: string = '';

  newFlat: Flat = this.resetFlat();

  apiUrl = environment.apiUrl;

  flatFormData: any = {
  flat_number: '',
  flat_type: '',
  price: null,
  tower_name: '',
  location: '',
  amenities: []
};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFlats();
    this.loadTowers();
  }

  /* ================= AUTH HEADERS ================= */

  getHeaders() {
    const token = localStorage.getItem('access_token');

    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      })
    };
  }

  /* ================= LOAD DATA ================= */

  loadTowers() {
    this.http.get<Tower[]>(`${this.apiUrl}/towers`, this.getHeaders())
      .subscribe({
        next: res => this.towers = res,
        error: err => console.error(err)
      });
  }

loadFlats() {

 this.http.get<Flat[]>(`${this.apiUrl}/flats/`, this.getHeaders())
 .subscribe({
   next: res => {

     this.flats = res.map((flat:any) => {

       let amenitiesArray:any[] = [];

       if (flat.amenities) {

         if (Array.isArray(flat.amenities)) {
           amenitiesArray = flat.amenities;
         }
         else if (typeof flat.amenities === 'string') {
           amenitiesArray = flat.amenities
           .split(',')
           .map((a:any) => a.trim());
         }
       }

       return {
         ...flat,
         amenities: amenitiesArray
       };

     });

   },
   error: err => console.error(err)
 });

}

getAmenitiesArray() {
  return this.amenitiesText
    ? this.amenitiesText
        .split(',')
        .map(a => a.trim())
        .filter(a => a)
    : [];
}

getAmenitiesText(amenities: any): string {

  if (!amenities) return 'Not specified';

  try {

    // If backend sends stringified JSON
    if (typeof amenities === 'string') {
      const parsed = JSON.parse(amenities);

      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      }

      return amenities;
    }

    // If backend sends array
    if (Array.isArray(amenities)) {
      return amenities.join(', ');
    }

  } catch (e) {
    return 'Not specified';
  }

  return 'Not specified';
}
saveFlat() {

  const amenitiesArray = this.amenitiesText
    ? this.amenitiesText
        .split(',')
        .map(a => a.trim())
        .filter(a => a)
    : [];

  const payload = {
    ...this.flatFormData,
    amenities: amenitiesArray
  };

  console.log("Prepared Flat Data:", payload);

  alert("Flat data prepared successfully!");
}

  /* ================= ADD FLAT ================= */

  addFlat() {

    const payload = {
      ...this.newFlat,
      amenities: this.amenitiesText
        ? this.amenitiesText.split(',').map(a => a.trim())
        : []
    };

    if (this.editingFlatId) {
      this.updateFlat();
      return;
    }

    this.http.post(
      `${this.apiUrl}/admin/flat`,
      payload,
      this.getHeaders()
    ).subscribe({
      next: () => {
        alert('🎉 Flat added successfully');
        this.loadFlats();
        this.newFlat = this.resetFlat();
        this.amenitiesText = '';
      },
      error: err => {
        console.error(err);
        alert('Failed to add flat');
      }
    });
  }

  /* ================= EDIT FLAT ================= */

  editFlat(flat: Flat) {

    this.editingFlatId = flat.id!;

    this.newFlat = { ...flat };

    this.amenitiesText =
      flat.amenities?.length
        ? flat.amenities.join(', ')
        : '';
  }

  /* ================= UPDATE FLAT ================= */

  updateFlat() {

    const payload = {
      ...this.newFlat,
      amenities: this.amenitiesText
        ? this.amenitiesText.split(',').map(a => a.trim())
        : []
    };

    this.http.put(
      `${this.apiUrl}/admin/flat/${this.editingFlatId}`,
      payload,
      this.getHeaders()
    ).subscribe({
      next: () => {
        alert('✏️ Flat updated successfully');
        this.loadFlats();
        this.cancelEdit();
      },
      error: err => {
        console.error(err);
        alert('Update failed');
      }
    });
  }

  /* ================= DELETE FLAT ================= */

  deleteFlat(id: number) {

    if (!confirm('Are you sure you want to delete this flat?')) return;

    this.http.delete(
      `${this.apiUrl}/admin/flat/${id}`,
      this.getHeaders()
    ).subscribe({
      next: () => {
        alert('🗑 Flat deleted');
        this.loadFlats();
      },
      error: err => {
        console.error(err);
        alert('Delete failed');
      }
    });
  }

  cancelEdit() {
    this.editingFlatId = null;
    this.newFlat = this.resetFlat();
    this.amenitiesText = '';
  }

  /* ================= RESET MODEL ================= */

  resetFlat(): Flat {
    return {
      flat_number: '',
      flat_type: '',
      tower_name: '',
      location: '',
      floor: null,
      price: null,
      image: '',
      amenities: []
    };
  }
}