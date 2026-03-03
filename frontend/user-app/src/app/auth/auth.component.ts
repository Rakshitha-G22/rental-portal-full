// src/app/auth/auth.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLogin = true;
  name = '';
  email = '';
  password = '';

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient, private router: Router) {}


  switchToLogin() { this.isLogin = true; }
  switchToRegister() { this.isLogin = false; }

  // ---------------- Login ----------------
  login() {
    if (!this.email || !this.password) {
      this.toastMessage = 'Please fill all fields!';
      this.toastType = 'error';
      return;
    }

    this.http.post<any>('http://127.0.0.1:5000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.token) {
          const username = res.name;
          this.toastMessage = `Welcome, ${username}!`;
          this.toastType = 'success';

          // ✅ Save username in localStorage
          localStorage.setItem('username', username);

          // ✅ Redirect to dashboard after 1.5s
          setTimeout(() => {
            this.router.navigate(['/flats']);
          }, 1500);

        } else {
          this.toastMessage = res.msg || 'Login failed!';
          this.toastType = 'error';
        }
      },
      error: (err) => {
        this.toastMessage = err.error?.msg || 'Server error!';
        this.toastType = 'error';
      }
    });
  }

  // ---------------- Register ----------------
  register() {
    if (!this.name || !this.email || !this.password) {
      this.toastMessage = 'Please fill all fields!';
      this.toastType = 'error';
      return;
    }

    this.http.post<any>('http://127.0.0.1:5000/api/auth/register', {
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.msg) {
          this.toastMessage = `Welcome, ${this.name}!`;
          this.toastType = 'success';

          // ✅ Save username in localStorage
          localStorage.setItem('username', this.name);

          // ✅ Redirect to dashboard after 1.5s
          setTimeout(() => {
            
           this.router.navigate(['/flats']);
          }, 1500);

        } else {
          this.toastMessage = res.msg || 'Registration failed!';
          this.toastType = 'error';
        }
      },
      error: (err) => {
        this.toastMessage = err.error?.msg || 'Server error!';
        this.toastType = 'error';
      }
    });
  }
}
