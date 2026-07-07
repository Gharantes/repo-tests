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
    this.routeLabel.set("");
    this.router.navigate(["login"]).then()
  }
  public goToDashboard() {
    this.routeLabel.set('Dashboard');
    this.router.navigate(['dashboard']).then();
  }

  /** ============ ACCOUNTS ============= **/
  public goToListAccounts() {
    this.routeLabel.set('Usuários');
    this.router.navigate(['accounts']).then();
  }
  public goToCreateAccount() {
    this.routeLabel.set('Registrar Usuários');
    this.router.navigate(['create-account']).then();
  }
  public goToEditAccount(idAccount: number) {
    this.routeLabel.set('Editar Usuário');
    this.router.navigate(['edit-account', idAccount]).then();
  }
  /** ============ PROJECTS ============= **/
  public goToListProjects() {
    this.routeLabel.set('Explorar Projetos');
    this.router.navigate(['projects']).then();
  }
  public goToCreateProject() {
    this.routeLabel.set("Registrar Projetos")
    this.router.navigate(["create-project"]).then()
  }
  public goToEditProject(idProject: number) {
    this.routeLabel.set('Editar Projeto');
    this.router.navigate(['edit-project', idProject]).then();
  }
  /** ============ TENANT ============= **/
  public goToCreateTenant() {
    this.routeLabel.set('Registrar Tenant');
    this.router.navigate(['create-tenant']).then();
  }
  /** ============ EVENTS ============= **/
  public goToListEvents() {
    this.routeLabel.set('Explorar Eventos')
    this.router.navigate(["events"]).then()
  }
  public goToCreateEvent() {
    this.routeLabel.set("Registrar Evento")
    this.router.navigate(["create-event"]).then()
  }
  public goToEditEvent(idEvent: number) {
    this.routeLabel.set('Editar Evento')
    this.router.navigate(["edit-event", idEvent]).then()
  }
  public goToEventDetails(idEvent: number) {
    this.routeLabel.set('Detalhes do Evento');
    this.router.navigate(['event', idEvent]).then()
  }
  public goToProjectDetails(idProject: number) {
    this.routeLabel.set('Detalhes do Projeto');
    this.router.navigate(['project', idProject]).then();
  }
  /** ============ TAGS ============= **/
  public goToListTags() {
    this.routeLabel.set("Visualizar Tags")
    this.router.navigate(["tags"]).then()
  }
  public goToCreateTag() {
    this.routeLabel.set("Registrar Tag")
    this.router.navigate(["create-tag"]).then()
  }
  public goToEditTag(idTag: number) {
    this.routeLabel.set("Editar Tag")
    this.router.navigate(["edit-tag", idTag]).then()
  }
  /** ============ PERMISSIONS ============= **/
  public goToListPermissions() {
    this.routeLabel.set('Permissões');
    this.router.navigate(['permissions']).then();
  }
}