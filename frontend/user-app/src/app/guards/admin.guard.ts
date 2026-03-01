import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);
const role = localStorage.getItem('role');

if (role === 'admin') {
  return true;
}

router.navigate(['/']);
return false;
}
