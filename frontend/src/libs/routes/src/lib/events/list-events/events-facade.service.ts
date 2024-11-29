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
    const textSearch = this.getFiltro()

    return this.eventRService.getAllEvent(idTenant, textSearch).pipe(
      tap((res) => this.events.set(res)),
      take(1)
    );
  }

  private filtro: string | null = null;

  setFiltro(res: string | null) {
    this.filtro = res;
  }
  getFiltro() {
    return this.filtro ?? undefined;
  }
}