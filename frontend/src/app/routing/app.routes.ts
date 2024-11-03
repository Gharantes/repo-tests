import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'login',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.loginRouteRoutes)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.homeRouteRoutes)
  },
  {
    path: 'events',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.eventsRoutes)
  },
];
