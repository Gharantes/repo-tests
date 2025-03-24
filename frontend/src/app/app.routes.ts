import { Route } from '@angular/router';
import { LoginRouteComponent } from './modules/login/login-route.component';
import { LoginAdminRouteComponent } from './modules/login_admin/login-admin-route.component';
import { NormalLayoutComponent } from './layout/normal-layout/normal-layout.component';
import { ListarUsuariosRouteComponent } from './modules/listar_usuarios/listar-usuarios-route.component';
import { ListarEventosRouteComponent } from './modules/listar_eventos/listar-eventos-route.component';
import { ListarProjetosRouteComponent } from './modules/listar_projetos/listar-eventos-route.component';
import { DashboardRouteComponent } from './modules/dashboard/dashboard-route.component';
import { RegistrarEventosRouteComponent } from './modules/registrar_eventos/registrar-eventos-route.component';

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
    path: 't/:id_tenant',
    canActivate: [],
    component: NormalLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        component: DashboardRouteComponent
      },
      {
        path: 'users',
        component: ListarUsuariosRouteComponent
      },
      {
        path: 'events',
        component: ListarEventosRouteComponent
      },
      {
        path: 'events/new',
        component: RegistrarEventosRouteComponent
      },
      {
        path: 'projects',
        component: ListarProjetosRouteComponent
      }
    ]
  },
];
