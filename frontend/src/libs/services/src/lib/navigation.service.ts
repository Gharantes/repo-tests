import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly activeRoute = signal<string>('home');
  private readonly previousRoute = signal<string>('home')

  constructor(private readonly router: Router) {
    this.router.setUpLocationChangeListener();

    this.navigationListener().pipe(
      tap(route => {
        this.previousRoute.set(this.activeRoute());
        this.activeRoute.set(route.url);
      })
    ).subscribe()
  }

  navigationListener() {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
  }

  getActiveRoute() {
    return this.activeRoute();
  }
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


  navigateEvents () {
    return {
      listAll: () => this.router.navigate(['events']),
      create: () => this.router.navigate(['events/create']),
    }
  }
  navigateProjects () {
    return {
      listAll: () => this.router.navigate(['projects']),
      create: () => this.router.navigate(['projects/create']),
    }
  }
}