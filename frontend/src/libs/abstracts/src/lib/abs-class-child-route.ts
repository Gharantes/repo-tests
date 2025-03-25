import { IDoRouteDetails } from "@synergia-frontend/interfaces";
import { AbsClassBasicRoute } from "./abs-class-basic-route";

export abstract class AbsClassChildRoute 
extends AbsClassBasicRoute {
    abstract parentRoute: IDoRouteDetails;

    public goToParentRoute() {
        this.routingService.goTo(this.parentRoute);
    }
}