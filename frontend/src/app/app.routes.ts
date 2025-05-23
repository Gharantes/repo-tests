import { Route } from '@angular/router';
import { LoginRouteComponent } from './modules/login/login-route.component';
import { NormalLayoutComponent } from './layout/normal-layout/normal-layout.component';
import { ListarUsuariosRouteComponent } from './modules/listar_usuarios/listar-usuarios-route.component';
import { ListarEventosRouteComponent } from './modules/listar_eventos/listar-eventos-route.component';
import { ListarProjetosRouteComponent } from './modules/listar_projetos/listar-projetos-route.component';
import { DashboardRouteComponent } from './modules/dashboard/dashboard-route.component';
import { RegistrarEventosRouteComponent } from './modules/registrar_eventos/registrar-eventos-route.component';
import { RegistrarUsuariosRouteComponent } from './modules/registrar_usuarios/registrar-usuarios-route.component';
import { RegistrarProjetosRouteComponent } from './modules/registrar_projetos/registrar-projetos-route.component';
import { RegistrarTenantRouteComponent } from './modules/registrar_tenant/registrar-tenant-route.component';
import { HasActiveTenant } from './security/routing/has-active-tenant';
import { DetalhesEventosRouteComponent } from './modules/detalhes_evento/detalhes-eventos-route.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginRouteComponent
  },
  {
    path: 'create-tenant',
    component: RegistrarTenantRouteComponent
  },
  {
    path: 't/:id_tenant',
    canActivate: [HasActiveTenant],
    component: NormalLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        component: DashboardRouteComponent
      },
      // Usuários
      {
        path: 'users',
        component: ListarUsuariosRouteComponent
      },
      {
        path: 'users/new',
        component: RegistrarUsuariosRouteComponent
      },
      // Eventos
      {
        path: 'events',
        component: ListarEventosRouteComponent
      },
      {
        path: 'event/details/:id_event',
        component: DetalhesEventosRouteComponent
      },
      {
        path: 'events/new',
        component: RegistrarEventosRouteComponent
      },
      // Projetos
      {
        path: 'projects',
        component: ListarProjetosRouteComponent
      },
      {
        path: 'projects/new',
        component: RegistrarProjetosRouteComponent
      },
    ]
  },
];
