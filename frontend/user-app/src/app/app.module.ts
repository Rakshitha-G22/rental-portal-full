import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';      
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AdminRoutingModule } from './admin-routing.module';
import { BookingConfirmComponent } from './userapp/booking-confirm/booking-confirm.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BookingConfirmComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule, 
    RouterModule,             
    HttpClientModule,
      AppRoutingModule,
     AdminRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
