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

    public setRouteInfo(r: { label: string, path: string }) {
        this.activeRouteInfo.set(r)
    }
    public goTo(r: { label: string, path: string }) {
        this.setRouteInfo(r);
        this.router.navigate([r.path]);
    }


    private activeTenant () {
        return 't/' + this.sessionService.getTenantId() + '/';
    }
    public dashboard(): IDoRouteDetails {
        return {
            label: 'Dashboard',
            path: this.activeTenant() + 'dashboard'
        }
    }
    public users(): IDoRouteDetails {
        return {
            label: 'Usuários',
            path: this.activeTenant() + 'users'
        }
    }
    public projects(): IDoRouteDetails {
        return {
            label: 'Projetos',
            path: this.activeTenant() + 'projects'
        }
    }
    public events(): IDoRouteDetails {
        return {
            label: 'Eventos',
            path: this.activeTenant() + 'events'
        }
    }
    public newEvents(): IDoRouteDetails {
        return {
            label: 'Registrar Eventos',
            path: this.activeTenant() + 'events/new'
        }
    }

public readonly routeLabelsConst: IDoRouteDetails[] = [
        this.dashboard(),
        this.users(),
        this.projects(),
        this.events()
    ]
}