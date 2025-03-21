import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "./session.service";

@Injectable({
    providedIn: 'root',
})
export class RoutingService {
    private readonly router = inject(Router);
    private readonly sessionService = inject(SessionService);

    public readonly activeRouteInfo = signal<{
        label: string,
        path: string
    } | null>(null)

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
    public dashboard() {
        return {
            label: 'Dashboard',
            path: this.activeTenant() + 'dashboard'
        }
    }
    public users() {
        return {
            label: 'Usuários',
            path: this.activeTenant() + 'users'
        }
    }
    public projects() {
        return {
            label: 'Projetos',
            path: this.activeTenant() + 'projects'
        }
    }
    public events() {
        return {
            label: 'Eventos',
            path: this.activeTenant() + 'events'
        }
    }

    public readonly routeLabelsConst = [
        this.dashboard(),
        this.users(),
        this.projects(),
        this.events()
    ]
}