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
import { RouteEventDetailsComponent } from './modules/page-details-event/route-event-details.component';
import { RouteListTagsComponent } from './modules/page-list-tags/route-list-tags.component';
import { RouteUpsertAccountComponent } from './modules/page-upsert-account/route-upsert-account.component';
import { RouteListPermissionsComponent } from './modules/page-list-permissions/route-list-permissions.component';
import { LayoutBeforeLoginComponent } from './layout/component-layout-before-login/layout-before-login.component';
import { RouteNotFoundComponent } from './modules/page-not-found/route-not-found.component';
import { RouteProjectDetailsComponent } from './modules/page-details-project/route-project-details.component';
import { RouteUpsertTagComponent } from './modules/page-upsert-tag/route-upsert-tag.component';



export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/out' },
  {
    path: '',
    component: LayoutBeforeLoginComponent,
    children: [
      {
        path: 'login',
        component: RouteLoginComponent
      },
      {
        path: 'create-tenant',
        component: RouteUpsertTenantComponent
      },
    ]
  },
  {
    path: '',
    canActivate: [HasActiveTenant],
    component: NormalLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: RouteDashboardComponent },
      // Usuários
      { path: 'accounts', component: RouteListAccountsComponent },
      { path: 'create-account', component: RouteUpsertAccountComponent },
      { path: 'edit-account/:id', component: RouteUpsertAccountComponent },
      // Eventos
      { path: 'events', component: RouteListEventsComponent },
      { path: 'create-event', component: RouteUpsertEventComponent },
      { path: 'edit-event/:id', component: RouteUpsertEventComponent },
      { path: 'event/:id', component: RouteEventDetailsComponent },
      // Projetos
      { path: 'projects', component: RouteListProjectsComponent },
      { path: 'create-project', component: RouteUpsertProjectComponent },
      { path: 'edit-project/:id', component: RouteUpsertProjectComponent },
      { path: 'project/:id', component: RouteProjectDetailsComponent },
      // Tags
      { path: 'tags', component: RouteListTagsComponent },
      { path: 'create-tag', component: RouteUpsertTagComponent },
      { path: 'edit-tag/:id', component: RouteUpsertTagComponent },
      // Permissões
      { path: 'permissions', component: RouteListPermissionsComponent }
    ]
  },
  { path: 'out', component: RouteNotFoundComponent },
  { path: '**', component: RouteNotFoundComponent },
];
