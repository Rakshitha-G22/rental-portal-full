import { Component } from '@angular/core';

@Component({
  selector: 'app-success',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-green-100">
      <h1 class="text-5xl font-bold text-green-700">
        🎉 Login Successful! Welcome to Dashboard.
      </h1>
    </div>
  `
})
export class SuccessComponent {}
