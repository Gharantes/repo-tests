import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly previousRoute = signal<string>('home')


  constructor(private readonly router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]).then();
  }
  navigateBack() {
    this.router.navigate([this.previousRoute()]).then()
  }
  navigateToHome() {
    this.router.navigate(['home']).then();
  }
  navigateToLogin() {
    this.router.navigate(['login']).then();
  }
}