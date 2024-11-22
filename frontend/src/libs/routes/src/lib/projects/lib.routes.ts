import { Route } from '@angular/router';
import { ProjectsRouteComponent } from './list-projects/projects-route.component';

export const projectsRoutes: Route[] = [
  {
    path: '', component: ProjectsRouteComponent
  },
];