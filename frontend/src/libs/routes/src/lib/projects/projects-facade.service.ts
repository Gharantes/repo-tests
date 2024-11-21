import { Injectable, signal } from '@angular/core';
import { debounceTime, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { ProjectDto, ProjectResourceService } from '@synergia-frontend/api';
import { TenantsService } from '@synergia-frontend/services';

@Injectable()
export class ProjectsFacadeService {
  private readonly ngUpdate = new Subject<void>();
  public readonly projects = signal<ProjectDto[]>([]);

  constructor(
    private readonly projectRService: ProjectResourceService,
    private readonly tenantService: TenantsService,
  ) {}

  initializeNgUpdate(ngUnsubscribe: Subject<void>) {
    this.ngUpdate
      .pipe(
        debounceTime(300),
        switchMap(() => this.queryAllProjects()),
        takeUntil(ngUnsubscribe)
      )
      .subscribe();
  }
  update() {
    this.ngUpdate.next();
  }
  queryAllProjects() {
    const idTenant = this.tenantService.getTenantId() ?? -1;
    return this.projectRService.getAllProjects(idTenant).pipe(
      tap((res) => this.projects.set(res)),
      take(1)
    );
  }
  createProject(form: {
    name: string | null | undefined;
    description: string | null | undefined;
  }) {
    this.projectRService
      .createProject({
        title: form.name ?? '',
        description: form.description ?? '',
        idTenant: this.tenantService.getTenantId() ?? -1
      })
      .pipe(tap(() => this.update()))
      .subscribe();
  }

  deleteProject(idProject: number) {
    const idTenant = this.tenantService.getTenantId() ?? -1
    this.projectRService
      .deleteProject(idTenant, idProject)
      .pipe(tap(() => this.update()))
      .subscribe();
  }
}