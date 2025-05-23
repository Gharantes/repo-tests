import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly tenant = signal<{ id: number, label: string } | null>(null);
    private readonly user = signal<{ id: number, label: string } | null>(null);

    public setUser(res: { id: number, label: string }) {
        this.user.set(res);
    }

    public setTenant(res: { id: number, label: string }) {
        this.tenant.set(res);
    }
    public clearTenant() { this.tenant.set(null); }

    public getUserId(): number | undefined {
        return this.user()?.id;
    }
    public getUserLabel(): string | undefined {
        return this.user()?.label;
    }

    public getTenantId(): number | undefined {
        return this.tenant()?.id;
    }
    public getTenantLabel(): string | undefined {
        return this.tenant()?.label
    }
}