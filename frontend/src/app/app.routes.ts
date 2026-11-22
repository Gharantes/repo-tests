import { Route } from '@angular/router';
import { RouteLoginComponent } from './modules/page-login/route-login.component';
import { NormalLayoutComponent } from './layout/component-normal-layout/normal-layout.component';
import { RouteListAccountsComponent } from './modules/page-list-accounts/route-list-accounts.component';
import { RouteListEventsComponent } from './modules/page-list-events/route-list-events.component';
import { RouteListProjectsComponent } from './modules/page-list-projects/route-list-projects.component';
import { RouteDashboardComponent } from './modules/page-dashboard/route-dashboard.component';
import { RouteUpsertEventComponent } from './modules/page-upsert-event/route-upsert-event.component';
import { RouteUpsertProjectComponent } from './modules/page-upsert-project/route-upsert-project.component';
import { HasActiveTenant } from './security/routing/has-active-tenant';
import { canEditAccount, hasPermission } from './security/routing/has-permission';
import { AuthPermission } from '@synergia-frontend/services';
import { RouteEventDetailsComponent } from './modules/page-details-event/route-event-details.component';
import { RouteListTagsComponent } from './modules/page-list-tags/route-list-tags.component';
import { RouteUpsertAccountComponent } from './modules/page-upsert-account/route-upsert-account.component';
import { LayoutBeforeLoginComponent } from './layout/component-layout-before-login/layout-before-login.component';
import { RouteNotFoundComponent } from './modules/page-not-found/route-not-found.component';
import { RouteProjectDetailsComponent } from './modules/page-details-project/route-project-details.component';
import { RouteUpsertTagComponent } from './modules/page-upsert-tag/route-upsert-tag.component';
import { RouteHomeComponent } from './modules/page-home/route-home.component';

/**
 * A raiz é a única página sem tenant (escolher ou registrar tenant).
 * Todo o resto fica sob /:tenant, onde :tenant é o identifier do tenant.
 */
export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutBeforeLoginComponent,
    children: [
      { path: '', pathMatch: 'full', component: RouteHomeComponent },
    ]
  },
  {
    path: ':tenant',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: '',
        component: LayoutBeforeLoginComponent,
        children: [
          { path: 'login', component: RouteLoginComponent },
        ]
      },
      {
        path: '',
        canActivate: [HasActiveTenant],
        component: NormalLayoutComponent,
        children: [
          { path: 'dashboard', component: RouteDashboardComponent },
          { path: 'lousa', loadComponent: () => import('./modules/page-lousa/route-lousa.component').then((m) => m.RouteLousaComponent) },
          // Usuários
          { path: 'accounts', component: RouteListAccountsComponent, canActivate: [hasPermission(AuthPermission.VIEW_ACCOUNTS_PAGE)] },
          { path: 'create-account', component: RouteUpsertAccountComponent, canActivate: [hasPermission(AuthPermission.CREATE_USER)] },
          { path: 'edit-account/:id', component: RouteUpsertAccountComponent, canActivate: [canEditAccount] },
          // Eventos
          { path: 'events', component: RouteListEventsComponent },
          { path: 'create-event', component: RouteUpsertEventComponent, canActivate: [hasPermission(AuthPermission.CREATE_EVENT)] },
          // Links antigos: a edição agora é feita na própria página do evento.
          { path: 'edit-event/:id', redirectTo: ({ params }) => `event/${params['id']}?edit=1` },
          { path: 'event/:id', component: RouteEventDetailsComponent },
          // Projetos
          { path: 'projects', component: RouteListProjectsComponent },
          { path: 'create-project', component: RouteUpsertProjectComponent, canActivate: [hasPermission(AuthPermission.CREATE_PROJECT)] },
          // Links antigos: a edição agora é feita na própria página do projeto.
          { path: 'edit-project/:id', redirectTo: ({ params }) => `project/${params['id']}?edit=1` },
          { path: 'project/:id', component: RouteProjectDetailsComponent },
          // Tags
          { path: 'tags', component: RouteListTagsComponent, canActivate: [hasPermission(AuthPermission.VIEW_TAGS_PAGE)] },
          { path: 'create-tag', component: RouteUpsertTagComponent, canActivate: [hasPermission(AuthPermission.CREATE_TAG)] },
          { path: 'edit-tag/:id', component: RouteUpsertTagComponent, canActivate: [hasPermission(AuthPermission.EDIT_TAG)] },
          // Permissões
          { path: 'permissions', loadComponent: () => import('./modules/page-list-permissions/route-list-permissions.component').then((m) => m.RouteListPermissionsComponent), canActivate: [hasPermission(AuthPermission.VIEW_PERMISSIONS_PAGE)] }
        ]
      },
    ]
  },
  { path: '**', component: RouteNotFoundComponent },
];
