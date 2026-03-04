import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {

  constructor(private router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean {

    const token = localStorage.getItem('access_token');

    if (token) {
      return true;
    }

    // Build full URL manually
    const fullUrl = '/' + segments.map(s => s.path).join('/');

    localStorage.setItem('returnUrl', fullUrl);

    this.router.navigate(['/auth']);

    return false;
  }
}