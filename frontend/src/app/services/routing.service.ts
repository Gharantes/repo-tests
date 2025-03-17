import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class RoutingService {
    private readonly router = inject(Router);
    
    public goToHome() {
        this.router.navigate(['tenant/1']);
    }
}