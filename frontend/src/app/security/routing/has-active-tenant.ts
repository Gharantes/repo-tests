import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { SessionService } from "@synergia-frontend/services";

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
      if (this.sessionService.getTenantId()) {
        return true;
      } 
      return this.router.parseUrl('login');
    }
  }
  