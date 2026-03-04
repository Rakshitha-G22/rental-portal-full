import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}