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

  constructor(private http: HttpClient, private router: Router) {}

  

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  submit() {

    if (this.isLogin) {
      // LOGIN
      
      this.http.post<any>('http://localhost:5000/api/auth/login', {
        email: this.formData.email,
        password: this.formData.password
      }).subscribe(res => {

        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);

        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/flats']);
        }


      });
    } else {
      // REGISTER
     this.http.post(`${environment.apiUrl}/api/auth/register`, this.formData)
        .subscribe(() => {
          alert("Registration successful! Please login.");
          this.isLogin = true;
        });
    }
  }
}
