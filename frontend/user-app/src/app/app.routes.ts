import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { FlatsComponent } from './userapp/flats/flats.component';
import { BookingConfirmComponent } from './userapp/booking-confirm/booking-confirm.component';
import { MyBookingsComponent } from './userapp/my-bookings/my-bookings.component';
import { ProfileComponent } from './userapp/profile/profile.component';
import { SupportComponent } from './userapp/support/support.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'flats', component: FlatsComponent },
{
 path: 'booking-confirm/:id',
 loadComponent: () =>
   import('./userapp/booking-confirm/booking-confirm.component')
   .then(m => m.BookingConfirmComponent),
 canMatch: [AuthGuard]
},

{
  path: 'my-bookings',
  loadComponent: () =>
    import('./userapp/my-bookings/my-bookings.component')
      .then(m => m.MyBookingsComponent),
  canMatch: [AuthGuard]
},

  { path: 'profile', component: ProfileComponent },
  { path: 'support', component: SupportComponent },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-routing.module').then((m) => m.AdminRoutingModule),
  },

  { path: '**', redirectTo: '' },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
