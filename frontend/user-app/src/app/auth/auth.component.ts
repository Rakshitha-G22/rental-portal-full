import { environment } from '../../environments/environment';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  isLogin = true;
  errorMsg = '';

  formData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMsg = '';
  }

  submit() {

    this.errorMsg = '';

    if (this.isLogin) {

      // LOGIN
      this.http.post<any>(
        `${environment.apiUrl}/auth/login`,
        {
          email: this.formData.email,
          password: this.formData.password
        }
      ).subscribe({
        next: (res) => {

          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('name', res.name);

          // Role based navigation
          if (res.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/flats']);
          }

        },
        error: () => {
          this.errorMsg = "Invalid email or password";
        }
      });

    } else {

      // REGISTER
      this.http.post(
        `${environment.apiUrl}/auth/register`,
        {
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password,
          role: 'user'   // Default role
        }
      ).subscribe({
        next: () => {
          alert("Registration successful! Please login");
          this.isLogin = true;
        },
        error: () => {
          this.errorMsg = "Registration failed";
        }
      });

    }
  }
}