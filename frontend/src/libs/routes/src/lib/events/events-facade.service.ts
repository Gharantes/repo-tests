import { Injectable, signal } from '@angular/core';
import { debounceTime, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { EventDto, EventResourceService } from '@synergia-frontend/api';
import { TenantsService } from '@synergia-frontend/services';

@Injectable()
export class EventsFacadeService {
  private readonly ngUpdate = new Subject<void>();
  public readonly events = signal<EventDto[]>([]);

  constructor(
    private readonly tenantsService: TenantsService,
    private readonly eventRService: EventResourceService
  ) {}

  initializeNgUpdate(ngUnsubscribe: Subject<void>) {
    this.ngUpdate
      .pipe(
        debounceTime(300),
        switchMap(() => this.queryAllEvents()),
        takeUntil(ngUnsubscribe)
      )
      .subscribe();
  }
  update() {
    this.ngUpdate.next();
  }
  queryAllEvents() {
    const idTenant = this.tenantsService.getTenantId() ?? -1
    return this.eventRService.getAllEvent(idTenant).pipe(
      tap((res) => this.events.set(res)),
      take(1)
    );
  }
  createEvent(form: {
    name: string | null | undefined;
    description: string | null | undefined;
  }) {
    const idTenant = this.tenantsService.getTenantId() ?? -1
    this.eventRService
      .createEvent({
        title: form.name ?? '',
        description: form.description ?? '',
        idTenant: idTenant
      })
      .pipe(tap(() => this.update()))
      .subscribe();
  }

  deleteEvent(idEvento: number) {
    const idTenant = this.tenantsService.getTenantId() ?? -1
    this.eventRService
      .deleteEvent(idTenant, idEvento)
      .pipe(tap(() => this.update()))
      .subscribe();
  }
}