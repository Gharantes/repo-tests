import { Route } from '@angular/router';
import { EventsRouteComponent } from './list-events/events-route.component';
import { CreateEventsRouteComponent } from './create-events/create-events-route.component';

export const eventsRoutes: Route[] = [
  { path: '', component: EventsRouteComponent },
  { path: 'create', component: CreateEventsRouteComponent },
];