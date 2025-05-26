import { Route } from '@angular/router';
import { LoginRouteComponent } from './modules/login/login-route.component';
import { NormalLayoutComponent } from './layout/normal-layout/normal-layout.component';
import { ListarUsuariosRouteComponent } from './modules/listar_usuarios/listar-usuarios-route.component';
import { ListarEventosRouteComponent } from './modules/listar_eventos/listar-eventos-route.component';
import { ListarProjetosRouteComponent } from './modules/listar_projetos/listar-projetos-route.component';
import { DashboardRouteComponent } from './modules/dashboard/dashboard-route.component';
import { RegistrarEventosRouteComponent } from './modules/registrar_eventos/registrar-eventos-route.component';
import { RegistrarProjetosRouteComponent } from './modules/registrar_projetos/registrar-projetos-route.component';
import { RegistrarTenantRouteComponent } from './modules/registrar_tenant/registrar-tenant-route.component';
import { HasActiveTenant } from './security/routing/has-active-tenant';
import { DetalhesEventosRouteComponent } from './modules/detalhes_evento/detalhes-eventos-route.component';
import { ListarTagsRouteComponent } from './modules/listar_tags/listar-tags-route.component';
import { RegistrarUsuariosRouteComponent } from './modules/registrar_usuarios/registrar-usuarios-route.component';


const dashboard = {
  path: 'dashboard',
  component: DashboardRouteComponent
}

const listarEventos = {
  path: 'events',
  component: ListarEventosRouteComponent
}
const detalhesEvento = {
  path: 'event/details/:id_event',
  component: DetalhesEventosRouteComponent
}
const registrarEventos = {
  path: 'events/new',
  component: RegistrarEventosRouteComponent
}


const listarUsuarios = {
  path: 'users',
  component: ListarUsuariosRouteComponent
}
const registrarUsuarios = {
  path: 'users/new',
  component: RegistrarUsuariosRouteComponent
}


const listarProjetosRoute = {
  path: 'projects',
  component: ListarProjetosRouteComponent
}
const registrarProjetosRoute = {
  path: 'projects/new',
  component: RegistrarProjetosRouteComponent
}

const listarTagsRoute = {
  path: 'tags',
  component: ListarTagsRouteComponent
}

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
      dashboard,
      // Usuários
      listarUsuarios,
      registrarUsuarios,
      // Eventos
      listarEventos,
      registrarEventos,
      detalhesEvento,
      // Projetos
      listarProjetosRoute,
      registrarProjetosRoute,
      // Tags
      listarTagsRoute
    ]
  },
];
