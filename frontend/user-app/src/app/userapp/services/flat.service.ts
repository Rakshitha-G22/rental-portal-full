import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Flat {
  id: number;
  flat_number: string;
  flat_type: string;
  location: string;
  tower_name: string;
  floor: number;
  price: number;
  image: string;
  amenities?: string[];
  is_booked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FlatService {

  // ✅ Base API URL
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ===============================
  // Get all flats
  // ===============================
  getAllFlats(): Observable<Flat[]> {
    return this.http.get<Flat[]>(`${this.apiUrl}/flats`);
  }

  // ===============================
  // Get flat by ID
  // ===============================
  getFlatById(id: number): Observable<Flat> {
    return this.http.get<Flat>(`${this.apiUrl}/flats/${id}`);
  }

}