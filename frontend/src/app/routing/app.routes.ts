import { Route } from '@angular/router';
import { homeRoutes, loginRoutes } from '@synergia-frontend/routes';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'login',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.loginRoutes)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.homeRoutes)
  },
  {
    path: 'events',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.eventsRoutes)
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.projectsRoutes)
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.rolesRoutes)
  },
  {
    path: 'users',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.usersRoutes)
  },
  {
    path: 'extra',
    loadChildren: () =>
      import('@synergia-frontend/routes').then(m => m.extraRoutes)
  },
];
