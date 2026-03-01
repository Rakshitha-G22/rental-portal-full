import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.component.html',
  imports: [CommonModule]
})
export class ReportsComponent implements OnInit {

  approved = 0;
  pending = 0;
  declined = 0;
  cancelled = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    const token = localStorage.getItem('access_token');

    this.http.get<any>('http://localhost:5000/api/admin/reports', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (data) => {
        this.approved = data.approved;
  this.declined = data.declined;
  this.cancelled = data.cancelled;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}