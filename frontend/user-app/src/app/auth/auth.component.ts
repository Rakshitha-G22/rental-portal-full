import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true
})
export class AuthComponent {

  isLogin = true;

  name = '';
  email = '';
  password = '';

  errorMsg = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMsg = '';
  }

  submit() {

    if (this.isLogin) {

      // LOGIN
      this.http.post<any>(
        `${environment.apiUrl}/auth/login`,
        {
          email: this.email,
          password: this.password
        }
      ).subscribe({
        next: (res) => {

          localStorage.setItem("token", res.token);
          localStorage.setItem("name", res.name);

          this.router.navigate(['/dashboard']);

        },
        error: () => {
          this.errorMsg = "Login failed";
        }
      });

    } else {

      // REGISTER
      this.http.post<any>(
        `${environment.apiUrl}/auth/register`,
        {
          name: this.name,
          email: this.email,
          password: this.password
        }
      ).subscribe({
        next: () => {
          alert("Registration successful");
          this.isLogin = true;
        },
        error: () => {
          this.errorMsg = "Registration failed";
        }
      });

    }
  }
}