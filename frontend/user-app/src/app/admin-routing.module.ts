import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './adminapp/admin-dashboard/admin-dashboard.component';
import { AdminTowersComponent } from './adminapp/admin-towers/admin-towers.component';
import { AdminFlatsComponent } from './adminapp/admin-flats/admin-flats.component';
import { AdminBookingsComponent } from './adminapp/admin-bookings/admin-bookings.component';
import { ReportsComponent } from './adminapp/reports/reports.component';
import { adminGuard } from './guards/admin.guard';


const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'flats', pathMatch: 'full' },
      { path: 'towers', component: AdminTowersComponent },
      { path: 'flats', component: AdminFlatsComponent },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
