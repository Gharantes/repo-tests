import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService
  ) {}

  public readonly routeLabel = signal<string>('');

  public async getParamFromRoute(
    route: ActivatedRoute,
    key: string
  ): Promise<string | null> {
    return (await firstValueFrom(route.paramMap)).get(key);
  }
  /**
   * As rotas internas ficam sob /<identifier do tenant>/. Sem tenant na sessão
   * não há para onde ir, então volta para a raiz.
   */
  private navigateInTenant(commands: (string | number)[]) {
    const identifier = this.sessionService.getTenantIdentifier();
    if (identifier == null) {
      this.goToHome();
      return;
    }
    this.router.navigate([identifier, ...commands]).then();
  }

  public goToHome() {
    this.routeLabel.set('');
    this.router.navigate(['']).then();
  }
  /** Sem identifier, usa o tenant da sessão; sem sessão, volta para a raiz. */
  public goToLogin(identifier?: string) {
    this.routeLabel.set("");
    const target = identifier ?? this.sessionService.getTenantIdentifier();
    if (target == null) {
      this.goToHome();
      return;
    }
    this.router.navigate([target, "login"]).then()
  }
  public goToDashboard() {
    this.routeLabel.set('Dashboard');
    this.navigateInTenant(['dashboard']);
  }

  /** ============ ACCOUNTS ============= **/
  public goToListAccounts() {
    this.routeLabel.set('Usuários');
    this.navigateInTenant(['accounts']);
  }
  public goToCreateAccount() {
    this.routeLabel.set('Registrar Usuários');
    this.navigateInTenant(['create-account']);
  }
  public goToEditAccount(idAccount: number) {
    this.routeLabel.set('Editar Usuário');
    this.navigateInTenant(['edit-account', idAccount]);
  }
  /** ============ PROJECTS ============= **/
  public goToListProjects() {
    this.routeLabel.set('Explorar Projetos');
    this.navigateInTenant(['projects']);
  }
  public goToCreateProject() {
    this.routeLabel.set("Registrar Projetos")
    this.navigateInTenant(["create-project"])
  }
  public goToEditProject(idProject: number) {
    this.routeLabel.set('Editar Projeto');
    this.navigateInTenant(['edit-project', idProject]);
  }
  /** ============ EVENTS ============= **/
  public goToListEvents() {
    this.routeLabel.set('Explorar Eventos')
    this.navigateInTenant(["events"])
  }
  public goToCreateEvent() {
    this.routeLabel.set("Registrar Evento")
    this.navigateInTenant(["create-event"])
  }
  public goToEditEvent(idEvent: number) {
    this.routeLabel.set('Editar Evento')
    this.navigateInTenant(["edit-event", idEvent])
  }
  public goToEventDetails(idEvent: number) {
    this.routeLabel.set('Detalhes do Evento');
    this.navigateInTenant(['event', idEvent])
  }
  public goToProjectDetails(idProject: number) {
    this.routeLabel.set('Detalhes do Projeto');
    this.navigateInTenant(['project', idProject]);
  }
  /** ============ TAGS ============= **/
  public goToListTags() {
    this.routeLabel.set("Visualizar Tags")
    this.navigateInTenant(["tags"])
  }
  public goToCreateTag() {
    this.routeLabel.set("Registrar Tag")
    this.navigateInTenant(["create-tag"])
  }
  public goToEditTag(idTag: number) {
    this.routeLabel.set("Editar Tag")
    this.navigateInTenant(["edit-tag", idTag])
  }
  /** ============ PERMISSIONS ============= **/
  public goToListPermissions() {
    this.routeLabel.set('Permissões');
    this.navigateInTenant(['permissions']);
  }
}