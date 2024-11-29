import { Route } from '@angular/router';
import { ProjectsRouteComponent } from './list-projects/projects-route.component';
import { CreateProjectsRouteComponent } from './create-projects/create-projects-route.component';

export const projectsRoutes: Route[] = [
  { path: '', component: ProjectsRouteComponent },
  { path: 'create', component: CreateProjectsRouteComponent },
];