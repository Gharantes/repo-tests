import { IDoRouteDetails } from '@synergia-frontend/interfaces';
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "./session.service";

@Injectable({
    providedIn: 'root',
})
export class RoutingService {
    private readonly router = inject(Router);
    private readonly sessionService = inject(SessionService);

    public readonly activeRouteInfo = signal<IDoRouteDetails | null>(null)

    public setRouteInfo(r: IDoRouteDetails) {
        this.activeRouteInfo.set(r)
    }
    public goTo(r: IDoRouteDetails) {
        this.setRouteInfo(r);
        this.router.navigate([r.path]);
    }


    private activeTenant () {
        return 't/' + this.sessionService.getTenantId() + '/';
    }
    
    public login: IDoRouteDetails = { label: 'Login', path: 'login' }
    
    public dashboard(): IDoRouteDetails {
        return {
            label: 'Dashboard',
            path: this.activeTenant() + 'dashboard'
        }
    }

    public users(): IDoRouteDetails {
        return { label: 'Usuários', path: this.activeTenant() + 'users' }
    }
    public newUsers(): IDoRouteDetails {
        return { label: 'Registrar Usuários', path: this.activeTenant() + 'users/new' }
    }

    public projects(): IDoRouteDetails {
        return { label: 'Projetos', path: this.activeTenant() + 'projects' }
    }
    public newProjects(): IDoRouteDetails {
        return { label: 'Registrar Projetos', path: this.activeTenant() + 'projects/new' }
    }

    public events(): IDoRouteDetails {
        return { label: 'Eventos', path: this.activeTenant() + 'events' }
    }
    public newEvents(): IDoRouteDetails {
        return { label: 'Registrar Eventos', path: this.activeTenant() + 'events/new' }
    }

public readonly routeLabelsConst: IDoRouteDetails[] = [
        this.dashboard(),
        this.users(),
        this.projects(),
        this.events()
    ]
}