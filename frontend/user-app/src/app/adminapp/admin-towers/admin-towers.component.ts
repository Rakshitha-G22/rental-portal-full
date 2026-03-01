import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-towers',
  standalone: true,
  templateUrl: './admin-towers.component.html',
  imports: [CommonModule,FormsModule,HttpClientModule]
})
export class AdminTowersComponent implements OnInit {

  towers: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTowers();
  }

  loadTowers() {
  const token = localStorage.getItem('access_token');

  this.http.get<any[]>('http://localhost:5000/api/admin/towers', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
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