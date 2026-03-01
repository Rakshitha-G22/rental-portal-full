import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-queries',
  standalone: true,
  imports:[CommonModule,FormsModule],
  template: `
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">User Queries</h2>

    <div *ngFor="let q of queries"
         class="border p-3 rounded mb-2">
      <p><strong>User ID:</strong> {{ q.user_id }}</p>
      <p><strong>Message:</strong> {{ q.message }}</p>
      <p><strong>Status:</strong> {{ q.status }}</p>
      <p><strong>Date:</strong> {{ q.created_at }}</p>
    </div>
  </div>
  `
})
export class QueriesComponent implements OnInit {

  queries: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    this.http.get<any[]>(`${environment.apiUrl}/api/admin/queries`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe(data => {
      this.queries = data;
    });
  }
}
