import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Submit Query</h2>

    <textarea [(ngModel)]="message"
              class="w-full border p-2 rounded"
              placeholder="Enter your query"></textarea>

    <button (click)="submit()"
            class="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
      Submit
    </button>
  </div>
  `
})
export class SupportComponent {

  message = '';

  constructor(private http: HttpClient) {}

  submit() {
    const token = localStorage.getItem('token');

    this.http.post(`${environment.apiUrl}/api/support`,
      { message: this.message },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe(() => {
      alert("Query submitted!");
      this.message = '';
    });
  }
}
