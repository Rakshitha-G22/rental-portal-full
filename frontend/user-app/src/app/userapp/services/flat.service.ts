import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flat {
  id: number;                // must be number to match backend
  title: string;
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

  private apiUrl = 'http://localhost:5000/api/flats';

  constructor(private http: HttpClient) {}

  // Fetch all flats
  getAllFlats(): Observable<Flat[]> {
    return this.http.get<Flat[]>(this.apiUrl);
  }

  // Fetch a single flat by ID
  getFlatById(id: number): Observable<Flat> {
    return this.http.get<Flat>(`${this.apiUrl}/${id}`);
  }
}
