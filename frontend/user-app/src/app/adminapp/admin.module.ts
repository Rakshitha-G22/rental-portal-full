import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // ⭐ IMPORTANT
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from '../admin-routing.module';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminTowersComponent } from './admin-towers/admin-towers.component';
import { AdminFlatsComponent } from './admin-flats/admin-flats.component';
import { AdminBookingsComponent } from './admin-bookings/admin-bookings.component';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminTowersComponent,
    AdminFlatsComponent,
    AdminBookingsComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,        // ⭐ VERY IMPORTANT
    HttpClientModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}