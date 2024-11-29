import {DestroyRef, Injectable, signal} from '@angular/core';
import { debounceTime, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { ProjectDto, ProjectResourceService } from '@synergia-frontend/api';
import { TenantsService } from '@synergia-frontend/services';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class ProjectsFacadeService {
  private readonly ngUpdate = new Subject<void>();
  public readonly projects = signal<ProjectDto[]>([]);

  constructor(
    private readonly projectRService: ProjectResourceService,
    private readonly tenantService: TenantsService,
  ) {}

  initializeNgUpdate(destroyRef: DestroyRef) {
    this.ngUpdate
      .pipe(
        debounceTime(300),
        switchMap(() => this.queryAllProjects()),
        takeUntilDestroyed(destroyRef)
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
}