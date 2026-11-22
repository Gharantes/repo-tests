import { Route } from '@angular/router';
import { NormalLayoutComponent } from './layout/component-normal-layout/normal-layout.component';
import { HasActiveTenant } from './security/routing/has-active-tenant';
import { canEditAccount, hasPermission } from './security/routing/has-permission';
import { AuthPermission } from '@synergia-frontend/services';
import { LayoutBeforeLoginComponent } from './layout/component-layout-before-login/layout-before-login.component';

/**
 * A raiz é a única página sem tenant (escolher ou registrar tenant).
 * Todo o resto fica sob /:tenant, onde :tenant é o identifier do tenant.
 *
 * Só os layouts entram no bundle inicial; cada página é baixada quando é aberta (loadComponent).
 * Com tudo junto, o bundle inicial passava do limite de 1 MB do build de produção e o deploy parava.
 */
export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutBeforeLoginComponent,
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./modules/page-home/route-home.component').then((m) => m.RouteHomeComponent) },
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
          { path: 'login', loadComponent: () => import('./modules/page-login/route-login.component').then((m) => m.RouteLoginComponent) },
        ]
      },
      {
        path: '',
        canActivate: [HasActiveTenant],
        component: NormalLayoutComponent,
        children: [
          { path: 'dashboard', loadComponent: () => import('./modules/page-dashboard/route-dashboard.component').then((m) => m.RouteDashboardComponent) },
          { path: 'lousa', loadComponent: () => import('./modules/page-lousa/route-lousa.component').then((m) => m.RouteLousaComponent) },
          // Usuários
          { path: 'accounts', loadComponent: () => import('./modules/page-list-accounts/route-list-accounts.component').then((m) => m.RouteListAccountsComponent), canActivate: [hasPermission(AuthPermission.VIEW_ACCOUNTS_PAGE)] },
          { path: 'create-account', loadComponent: () => import('./modules/page-upsert-account/route-upsert-account.component').then((m) => m.RouteUpsertAccountComponent), canActivate: [hasPermission(AuthPermission.CREATE_USER)] },
          { path: 'edit-account/:id', loadComponent: () => import('./modules/page-upsert-account/route-upsert-account.component').then((m) => m.RouteUpsertAccountComponent), canActivate: [canEditAccount] },
          // Eventos
          { path: 'events', loadComponent: () => import('./modules/page-list-events/route-list-events.component').then((m) => m.RouteListEventsComponent) },
          { path: 'create-event', loadComponent: () => import('./modules/page-upsert-event/route-upsert-event.component').then((m) => m.RouteUpsertEventComponent), canActivate: [hasPermission(AuthPermission.CREATE_EVENT)] },
          // Links antigos: a edição agora é feita na própria página do evento.
          { path: 'edit-event/:id', redirectTo: ({ params }) => `event/${params['id']}?edit=1` },
          { path: 'event/:id', loadComponent: () => import('./modules/page-details-event/route-event-details.component').then((m) => m.RouteEventDetailsComponent) },
          // Projetos
          { path: 'projects', loadComponent: () => import('./modules/page-list-projects/route-list-projects.component').then((m) => m.RouteListProjectsComponent) },
          { path: 'create-project', loadComponent: () => import('./modules/page-upsert-project/route-upsert-project.component').then((m) => m.RouteUpsertProjectComponent), canActivate: [hasPermission(AuthPermission.CREATE_PROJECT)] },
          // Links antigos: a edição agora é feita na própria página do projeto.
          { path: 'edit-project/:id', redirectTo: ({ params }) => `project/${params['id']}?edit=1` },
          { path: 'project/:id', loadComponent: () => import('./modules/page-details-project/route-project-details.component').then((m) => m.RouteProjectDetailsComponent) },
          // Tags
          { path: 'tags', loadComponent: () => import('./modules/page-list-tags/route-list-tags.component').then((m) => m.RouteListTagsComponent), canActivate: [hasPermission(AuthPermission.VIEW_TAGS_PAGE)] },
          { path: 'create-tag', loadComponent: () => import('./modules/page-upsert-tag/route-upsert-tag.component').then((m) => m.RouteUpsertTagComponent), canActivate: [hasPermission(AuthPermission.CREATE_TAG)] },
          { path: 'edit-tag/:id', loadComponent: () => import('./modules/page-upsert-tag/route-upsert-tag.component').then((m) => m.RouteUpsertTagComponent), canActivate: [hasPermission(AuthPermission.EDIT_TAG)] },
          // Permissões
          { path: 'permissions', loadComponent: () => import('./modules/page-list-permissions/route-list-permissions.component').then((m) => m.RouteListPermissionsComponent), canActivate: [hasPermission(AuthPermission.VIEW_PERMISSIONS_PAGE)] }
        ]
      },
    ]
  },
  { path: '**', loadComponent: () => import('./modules/page-not-found/route-not-found.component').then((m) => m.RouteNotFoundComponent) },
];
