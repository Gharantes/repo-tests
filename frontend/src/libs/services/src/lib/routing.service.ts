import { Injectable, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IDoRouteDetails } from '@synergia-frontend/interfaces';
import { SessionService } from "./session.service";
import { firstValueFrom, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RoutingService {
    constructor (
        private readonly router: Router,
        private readonly sessionService: SessionService
    ) {}

    public readonly activeRouteInfo = signal<IDoRouteDetails | null>(null)

    public async getParamFromRoute(route: ActivatedRoute, key: string): Promise<string | null> {
      return (await firstValueFrom(route.paramMap)).get(key)
    }
    public setRouteInfo(r: IDoRouteDetails) {
        this.activeRouteInfo.set(r)
    }
    public goTo(r: IDoRouteDetails) {
        this.setRouteInfo(r);
        this.router.navigate(r.path).then(success => {
            console.log('Navigation Success?', success);
        }, error => {
            console.log('Navigation Error?', error);
        })
    }


    private activeTenant (): string[] {
        const idTenant = this.sessionService.getTenantId()?.toString() ?? 'null';
        return ['t', idTenant];
    }

 
    public login(): IDoRouteDetails { 
        return { label: 'Login', path: ['login'] }
    }
    public createTenant(): IDoRouteDetails {
        return { label: 'Registrar Tenant', path: ['create-tenant'] }; 
    }
    public dashboard(): IDoRouteDetails {
        return {
            label: 'Dashboard',
            path: [...this.activeTenant(), 'dashboard']
        }
    }

    public users(): IDoRouteDetails {
        return { 
            label: 'Usuários', 
            path: [...this.activeTenant(), 'users']
        }
    }
    public newUsers(): IDoRouteDetails {
        return { 
            label: 'Registrar Usuários', 
            path: [...this.activeTenant(), 'users', 'new']
        }
    }

    public projects(): IDoRouteDetails {
        return {
            label: 'Projetos',
            path: [...this.activeTenant(), 'projects']
        }
    }
    public newProjects(): IDoRouteDetails {
        return { 
            label: 'Registrar Projetos',
            path: [...this.activeTenant(), 'projects', 'new']
        }
    }

    public events(): IDoRouteDetails {
        return { 
            label: 'Eventos',
            path: [...this.activeTenant(), 'events'] 
        }
    }
    public eventDetails(idEvent: number): IDoRouteDetails {
        return { 
            label: 'Detalhes do Evento', 
            path: [...this.activeTenant(), 'event', 'details', idEvent.toString()]
        }
    }
    public newEvents(): IDoRouteDetails {
        return { 
            label: 'Registrar Eventos', 
            path: [...this.activeTenant(), 'events', 'new']
        }
    }
  public editEvents(id: number): IDoRouteDetails {
    return {
      label: 'Editar Evento',
      path: [...this.activeTenant(), 'event', 'edit', id.toString()]
    }
  }
  editProject(id: number): IDoRouteDetails {
    return {
      label: 'Editar Projeto',
      path: [...this.activeTenant(), 'project', 'edit', id.toString()]
    }
  }

    public listarTags(): IDoRouteDetails {
        return {
            label: 'Tags',
            path: [...this.activeTenant(), 'tags']
        }
    }

    public getRouteLabels(): IDoRouteDetails[] {
      return [
        this.dashboard(),
        this.users(),
        this.projects(),
        this.events(),
        this.listarTags()
      ]
    }
}