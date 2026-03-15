import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(private readonly router: Router) {}

  public readonly routeLabel = signal<string>('');

  public async getParamFromRoute(
    route: ActivatedRoute,
    key: string
  ): Promise<string | null> {
    return (await firstValueFrom(route.paramMap)).get(key);
  }
  public goToLogin() {
    this.routeLabel.set("Login");
    this.router.navigate(["login"]).then()
  }

  public goToDashboard() {
    this.routeLabel.set('Dashboard');
    this.router.navigate(['dashboard']).then();
  }
  public goToListAccounts() {
    this.routeLabel.set('Usuários');
    this.router.navigate(['users']).then();
  }
  public goToListProjects() {
    this.routeLabel.set('Projetos');
    this.router.navigate(['projects']).then();
  }
  public goToCreateTenant() {
    this.routeLabel.set('Registrar Tenant');
    this.router.navigate(['create-tenant']).then();
  }
  public goToCreateAccount() {
    this.routeLabel.set('Registrar Usuários');
    this.router.navigate(['create-account']).then();
  }
  public goToCreateEvent() {
    this.routeLabel.set("Registrar Evento")
    this.router.navigate(["create-event"]).then()
  }
  public goToCreateProject() {
    this.routeLabel.set("Registrar Projetos")
    this.router.navigate(["create-project"]).then()
  }
  public goToEditAccount(idAccount: number) {
    this.routeLabel.set('Editar Usuário');
    this.router.navigate(['edit-account', idAccount]).then();
  }
  public goToEditEvent(idEvent: number) {
    this.routeLabel.set('Editar Evento')
    this.router.navigate(["edit-event", idEvent]).then()
  }
  public goToEditProject(idProject: number) {
    this.routeLabel.set('Editar Projeto');
    this.router.navigate(['edit-project', idProject]).then();
  }
  public goToListEvents() {
    this.routeLabel.set('Eventos')
    this.router.navigate(["events"]).then()
  }
  public goToListTags() {
    this.routeLabel.set("Tags")
    this.router.navigate(["tags"]).then()
  }
  public goToEventDetails(idEvent: number) {
    this.routeLabel.set('Detalhes do Evento');
    this.router.navigate(['event', 'details', idEvent]).then()
  }

    // projectPage(id: number): IDoRouteDetails {
    //   return {
    //     label: 'Página do Projeto',
    //     path: [...this.activeTenant(), 'project-page', id.toString()],
    //   };
    // }
}