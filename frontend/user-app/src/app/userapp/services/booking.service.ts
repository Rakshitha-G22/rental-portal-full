import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingsUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // ✅ Create booking
  createBooking(data: any, token: string) {

    return this.http.post(
      `${this.bookingsUrl}/bookings`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  }

  // ✅ Get user bookings
  getMyBookings(token: string) {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      `${this.bookingsUrl}/bookings/my`,
      { headers }
    );
  }

  // ✅ Cancel booking
  cancelBooking(id: number, token: string) {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(
      `${this.bookingsUrl}/bookings/${id}`,
      { headers }
    );
  }

  // ✅ Download receipt
  downloadReceipt(id: number, token: string) {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      `${this.bookingsUrl}/bookings/receipt/${id}`,
      {
        headers,
        responseType: 'blob'
      }
    );
  }
}