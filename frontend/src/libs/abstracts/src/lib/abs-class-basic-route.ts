import { RoutingService, SessionService } from '@synergia-frontend/services';
import { inject } from '@angular/core';
import { AbsClassNonParameterizedRoute } from './abs-class-non-parameterized-route';

export abstract class AbsClassBasicRoute 
implements AbsClassNonParameterizedRoute {
    public readonly routingService = inject(RoutingService);
    public readonly sessionService = inject(SessionService);

    abstract setRouteInfo(): void;
}

