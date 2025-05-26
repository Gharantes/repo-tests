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
    public logout() {
      this.tenant.set(null);
      this.user.set(null);
      localStorage.removeItem('login-data');
    }

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

    public saveSessionOnLocalStorage() {
      const loginData = JSON.stringify({
        tenant: this.tenant(),
        user: this.user()
      })
      localStorage.setItem('login-data', loginData);
    }
    public retrieveSessionFromLocalStorage() {
      const storage = localStorage.getItem('login-data')
      if (storage === null) {
        return null
      }
      const loginData: {
        tenant: { id: number, label: string } | null,
        user: { id: number, label: string } | null
      } = JSON.parse(storage)
      return loginData
    }
}