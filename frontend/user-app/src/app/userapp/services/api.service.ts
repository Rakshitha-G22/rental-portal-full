import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private BASE_URL = environment.apiUrl; // ✅ REMOVE /api HERE

  constructor(private http: HttpClient) {}

  // ================= AUTH =================

  register(user: { name: string; email: string; password: string }) {
    return this.http.post(`${this.BASE_URL}/auth/register`, user);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.BASE_URL}/auth/login`, credentials);
  }

  // ================= FLATS =================

  getFlats() {
    return this.http.get(`${this.BASE_URL}/flats`);
  }

  // ================= BOOKINGS =================

  confirmBooking(flatId: number, token: string) {
    return this.http.post(
      `${this.BASE_URL}/bookings/book/${flatId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  requestBooking(flatId: number, token: string) {
    return this.http.post(
      `${this.BASE_URL}/bookings/${flatId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getMyBookings(token: string) {
    return this.http.get(`${this.BASE_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  cancelBooking(bookingId: number, token: string) {
    return this.http.put(
      `${this.BASE_URL}/bookings/cancel/${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  downloadReceipt(bookingId: number, token: string) {
    return this.http.get(
      `${this.BASE_URL}/bookings/receipt/${bookingId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );
  }
}