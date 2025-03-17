import { Route } from '@angular/router';
import { LoginRouteComponent } from './modules/login/login-route.component';
import { LoginAdminRouteComponent } from './modules/login_admin/login-admin-route.component';
import { NormalLayoutComponent } from './layout/normal-layout/normal-layout.component';
import { ListarUsuariosRouteComponent } from './modules/listar_usuarios/listar-usuarios-route.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginRouteComponent
  },
  {
    path: 'admin',
    component: LoginAdminRouteComponent
  },
  {
    path: 'tenant/:id_tenant',
    canActivate: [],
    component: NormalLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      {
        path: 'users',
        component: ListarUsuariosRouteComponent
      }
    ]
  },
];
