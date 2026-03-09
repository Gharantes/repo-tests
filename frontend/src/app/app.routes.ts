import { Route } from '@angular/router';
import { LoginRouteComponent } from './modules/login/login-route.component';
import { NormalLayoutComponent } from './layout/normal-layout/normal-layout.component';
import { ListarUsuariosRouteComponent } from './modules/listar_usuarios/listar-usuarios-route.component';
import { ListarEventosRouteComponent } from './modules/listar_eventos/listar-eventos-route.component';
import { RouteListProjectsComponent } from './modules/page-list-projects/route-list-projects.component';
import { DashboardRouteComponent } from './modules/dashboard/dashboard-route.component';
import { RouteUpsertEventComponent } from './modules/page-upsert-event/route-upsert-event.component';
import { RouteUpsertProjectComponent } from './modules/page-upsert-project/route-upsert-project.component';
import { RouteUpsertTenantComponent } from './modules/registrar_tenant/route-upsert-tenant.component';
import { HasActiveTenant } from './security/routing/has-active-tenant';
import { DetalhesEventosRouteComponent } from './modules/detalhes_evento/detalhes-eventos-route.component';
import { ListarTagsRouteComponent } from './modules/page-list-tags/listar-tags-route.component';
import { RegistrarUsuariosRouteComponent } from './modules/registrar_usuarios/registrar-usuarios-route.component';
import { ListarPermissoesRouteComponent } from './modules/listar_permissoes/listar-permissoes-route.component';
import { PaginaProjetoRouteComponent } from './modules/pagina_projeto/pagina-projeto-route.component';



export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginRouteComponent
  },
  {
    path: 'create-tenant',
    component: RouteUpsertTenantComponent
  },
  {
    path: 't/:id_tenant',
    canActivate: [HasActiveTenant],
    component: NormalLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardRouteComponent },
      // Usuários
      { path: 'users', component: ListarUsuariosRouteComponent },
      { path: 'users/new', component: RegistrarUsuariosRouteComponent },
      { path: 'users/edit/:id', component: RegistrarUsuariosRouteComponent },
      // Eventos
      { path: 'events', component: ListarEventosRouteComponent },
      { path: 'events/new', component: RouteUpsertEventComponent },
      { path: 'event/details/:id_event', component: DetalhesEventosRouteComponent },
      { path: 'event/edit/:id', component: RouteUpsertEventComponent },
      // Projetos
      { path: 'projects', component: RouteListProjectsComponent },
      { path: 'projects/new', component: RouteUpsertProjectComponent },
      { path: 'project/edit/:id', component: RouteUpsertProjectComponent },
      { path: 'project-page/:id', component: PaginaProjetoRouteComponent },
      // Tags
      { path: 'tags', component: ListarTagsRouteComponent },
      // Permissões
      { path: 'permissions', component: ListarPermissoesRouteComponent }
    ]
  },
];
