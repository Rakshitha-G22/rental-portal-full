import { environment } from '../../environments/environment';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  isLogin = true;

  formData = {
    name: '',
    email: '',
    password: ''
  };

  private BASE_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  submit() {

    // ================= LOGIN =================
    if (this.isLogin) {

      this.http.post<any>(
        `${this.BASE_URL}/auth/login`,
        {
          email: this.formData.email,
          password: this.formData.password
        }
      ).subscribe({

        next: (res: any) => {

          const token = res.access_token || res.token;

          if (!token) {
            alert("Invalid login response");
            return;
          }

          localStorage.setItem('access_token', token);
          localStorage.setItem('role', res.role || '');
          localStorage.setItem('name', res.name || '');

          // ✅ Get returnUrl from query params
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'];

          setTimeout(() => {

            if (returnUrl) {
              this.router.navigateByUrl(returnUrl);
            }
            else if (res.role === 'admin') {
              this.router.navigate(['/admin']);
            }
            else {
              this.router.navigate(['/flats']);
            }

          }, 300);

        },

        error: (err) => {
          console.error(err);
          alert(err.error?.msg || "Login failed");
        }

      });

    }

    // ================= REGISTER =================
    else {

      this.http.post(
        `${this.BASE_URL}/auth/register`,
        this.formData
      ).subscribe({

        next: () => {

          alert("Registration successful! Please login.");

          this.isLogin = true;

          this.formData = {
            name: '',
            email: '',
            password: ''
          };

        },

        error: (err) => {
          console.error(err);
          alert(err.error?.msg || "Registration failed");
        }

      });

    }

  }

}