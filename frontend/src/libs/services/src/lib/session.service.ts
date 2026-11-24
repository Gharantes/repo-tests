import { Injectable, signal } from "@angular/core";

interface DadosDeLogin {
  tenant: { id: number, label: string, identifier?: string } | null,
  user: { id: number, label: string } | null,
  /** Token da sessão no backend. Vai em `Authorization: Bearer ...` (ver autenticacao.interceptor). */
  token?: string | null,
}

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly tenant = signal<{ id: number, label: string, identifier: string } | null>(null);
    private readonly user = signal<{ id: number, label: string } | null>(null);
    private readonly token = signal<string | null>(null);
    /** Códigos (AuthPermission) do usuário logado. Recarregados a cada login pelo PermissionService. */
    private readonly permissions = signal<ReadonlySet<string>>(new Set());

    public setUser(res: { id: number, label: string }) {
        this.user.set(res);
    }
    public setTenant(res: { id: number, label: string, identifier: string }) {
        this.tenant.set(res);
    }
    public setToken(token: string | null | undefined) {
        this.token.set(token ?? null);
    }
    public getToken(): string | null {
        return this.token();
    }
    public setPermissions(codes: string[]) {
        this.permissions.set(new Set(codes));
    }
    public hasPermission(code: string): boolean {
        return this.permissions().has(code);
    }
    public logout() {
      this.tenant.set(null);
      this.user.set(null);
      this.token.set(null);
      this.permissions.set(new Set());
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
    public getTenantIdentifier(): string | undefined {
        return this.tenant()?.identifier
    }

    public saveSessionOnLocalStorage() {
      const loginData: DadosDeLogin = {
        tenant: this.tenant(),
        user: this.user(),
        token: this.token(),
      };
      localStorage.setItem('login-data', JSON.stringify(loginData));
    }
    public retrieveSessionFromLocalStorage(): DadosDeLogin | null {
      const storage = localStorage.getItem('login-data')
      if (storage === null) {
        return null
      }
      return JSON.parse(storage) as DadosDeLogin
    }
}
