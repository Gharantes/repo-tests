import { Route } from '@angular/router';
import { RouteLoginComponent } from './modules/page-login/route-login.component';
import { NormalLayoutComponent } from './layout/component-normal-layout/normal-layout.component';
import { RouteListAccountsComponent } from './modules/page-list-accounts/route-list-accounts.component';
import { RouteListEventsComponent } from './modules/page-list-events/route-list-events.component';
import { RouteListProjectsComponent } from './modules/page-list-projects/route-list-projects.component';
import { RouteDashboardComponent } from './modules/page-dashboard/route-dashboard.component';
import { RouteUpsertEventComponent } from './modules/page-upsert-event/route-upsert-event.component';
import { RouteUpsertProjectComponent } from './modules/page-upsert-project/route-upsert-project.component';
import { RouteUpsertTenantComponent } from './modules/page-upsert-tenant/route-upsert-tenant.component';
import { HasActiveTenant } from './security/routing/has-active-tenant';
import { RouteEventDetailsComponent } from './modules/page-event-details/route-event-details.component';
import { RouteListTagsComponent } from './modules/page-list-tags/route-list-tags.component';
import { RouteUpsertAccountComponent } from './modules/page-upsert-account/route-upsert-account.component';
import { RouteListPermissionsComponent } from './modules/page-list-permissions/route-list-permissions.component';



export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: RouteLoginComponent
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
      { path: 'dashboard', component: RouteDashboardComponent },
      // Usuários
      { path: 'users', component: RouteListAccountsComponent },
      { path: 'users/new', component: RouteUpsertAccountComponent },
      { path: 'users/edit/:id', component: RouteUpsertAccountComponent },
      // Eventos
      { path: 'events', component: RouteListEventsComponent },
      { path: 'events/new', component: RouteUpsertEventComponent },
      { path: 'event/edit/:id', component: RouteUpsertEventComponent },
      { path: 'event/details/:id_event', component: RouteEventDetailsComponent },
      // Projetos
      { path: 'projects', component: RouteListProjectsComponent },
      { path: 'projects/new', component: RouteUpsertProjectComponent },
      { path: 'project/edit/:id', component: RouteUpsertProjectComponent },
      // Tags
      { path: 'tags', component: RouteListTagsComponent },
      // Permissões
      { path: 'permissions', component: RouteListPermissionsComponent }
    ]
  },
];
