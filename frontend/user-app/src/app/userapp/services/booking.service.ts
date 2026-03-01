import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flat } from './flat.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingsUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) {}

  // Create a booking

  createBooking(flatId: number, token: string) {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post(
    `${this.bookingsUrl}`,
    { flat_id: flatId },
    { headers }
  );
}

  bookFlat(flatId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      this.bookingsUrl,
      { flat_id: flatId },
      { headers }
    );
  }

  // Get logged-in user's bookings
getMyBookings(token: string) {

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any>(
    'http://127.0.0.1:5000/api/bookings/my',
    { headers }
  );
}




  // Cancel a booking
  cancelBooking(id: number, token: string) {

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.delete(
    `http://127.0.0.1:5000/api/bookings/${id}`,
    { headers }
  );
}

downloadReceipt(id: number, token: string) {

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get(
    `http://127.0.0.1:5000/api/bookings/receipt/${id}`,
    {
      headers,
      responseType: 'blob'
    }
  );
}


}
