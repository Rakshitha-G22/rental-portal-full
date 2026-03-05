import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-admin-towers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-towers.component.html'
})
export class AdminTowersComponent implements OnInit {

  towers: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getTowers();
  }

  getTowers() {

  const token = localStorage.getItem('access_token');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  this.http.get<any[]>(`${environment.apiUrl}/admin/towers`, { headers })
    .subscribe({
      next: (data) => {
        this.towers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load towers';
        this.loading = false;
      }
    });
}
}