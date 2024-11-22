import { DestroyRef, Injectable, signal } from '@angular/core';
import { debounceTime, Subject, switchMap, take, tap } from 'rxjs';
import { EventDto, EventResourceService } from '@synergia-frontend/api';
import { TenantsService } from '@synergia-frontend/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class EventsFacadeService {
  private readonly ngUpdate = new Subject<void>();
  public readonly events = signal<EventDto[]>([]);

  constructor(
    private readonly tenantsService: TenantsService,
    private readonly eventRService: EventResourceService
  ) {}

  initializeNgUpdate(destroyRef: DestroyRef) {
    this.ngUpdate
      .pipe(
        debounceTime(300),
        switchMap(() => this.queryAllEvents()),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe();
  }
  update() {
    this.ngUpdate.next();
  }
  private queryAllEvents() {
    const idTenant = this.tenantsService.getTenantId() ?? -1;
    return this.eventRService.getAllEvent(idTenant).pipe(
      tap((res) => this.events.set(res)),
      take(1)
    );
  }
}