import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly tenant = signal<{ id: number, label: string } | null>(null);
    private readonly user = signal<{ id: number, label: string } | null>(null);

    public setUser() {
        console.log('TODO');
    }
    public setTenant() {
        console.log('TODO');
    }

    public getUserId(): number {
        return 1;
    }
    public getUserLabel(): string {
        return 'Guilherme';
    }

    public getTenantId(): number {
        return 1;
    }
    public getTenantLabel(): string {
        return 'Tenant-Testes';
    }
}