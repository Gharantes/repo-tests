import { Injectable, signal } from '@angular/core';
import { EventoDto, EventoResourceService, ProjetoDto, ProjetoResourceService } from '@synergia-frontend/api';
import { debounceTime, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

@Injectable()
export class ProjectsFacadeService {
  private readonly ngUpdate = new Subject<void>();
  public readonly projects = signal<ProjetoDto[]>([])

  constructor(
    private readonly service: ProjetoResourceService
  ) {
  }


  initializeNgUpdate(ngUnsubscribe: Subject<void>) {
    this.ngUpdate.pipe(
      debounceTime(300),
      switchMap(() => this.queryAllProjects()),
      takeUntil(ngUnsubscribe),
    ).subscribe()
  }
  update() {
    this.ngUpdate.next();
  }
  queryAllProjects() {
    return this.service.getAllProjects().pipe(
      tap(res => this.projects.set(res)),
      take(1)
    )
  }
  createProject(form: { name: string | null | undefined; description: string | null | undefined }) {
    this.service.createProject({
      name: form.name ?? '',
      description: form.description ?? ''
    }).pipe(
      tap(() => this.update())
    ).subscribe()
  }

  deleteProject(idProject: number) {
    this.service.deleteProject(idProject).pipe(
      tap(() => this.update())
    ).subscribe()
  }
}