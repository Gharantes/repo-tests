import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { SessionService } from "@synergia-frontend/services";

/**
 * Libera as rotas internas só quando a sessão é do mesmo tenant da URL.
 * Sem isso, quem está logado em /a conseguiria abrir /b/dashboard com a sessão de /a.
 */
@Injectable({
    providedIn: "root",
  })
  export class HasActiveTenant implements CanActivate {
    constructor(
      private readonly sessionService: SessionService,
      private readonly router: Router
    ) {}

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean | UrlTree {
      const tenantInUrl = route.pathFromRoot
        .map((r) => r.paramMap.get('tenant'))
        .find((t) => t != null);

      if (tenantInUrl == null) {
        return this.router.createUrlTree(['']);
      }
      if (this.sessionService.getTenantId() && this.sessionService.getTenantIdentifier() === tenantInUrl) {
        return true;
      }
      return this.router.createUrlTree([tenantInUrl, 'login']);
    }
  }
