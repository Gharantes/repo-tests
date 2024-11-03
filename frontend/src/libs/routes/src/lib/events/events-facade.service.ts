import { DestroyRef, Injectable, signal } from '@angular/core';
import { EventoDto, EventoResourceService } from '@synergia-frontend/api';
import { BehaviorSubject, debounceTime, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

@Injectable()
export class EventsFacadeService {
  private readonly ngUpdate = new Subject<void>();
  public readonly events = signal<EventoDto[]>([])


  constructor(
    private readonly service: EventoResourceService,
  ) {
  }

  initializeNgUpdate(ngUnsubscribe: Subject<void>) {
    this.ngUpdate.pipe(
      debounceTime(300),
      switchMap(() => this.queryAllEvents()),
      takeUntil(ngUnsubscribe),
    ).subscribe()
  }
  update() {
    this.ngUpdate.next();
  }
  queryAllEvents() {
    return this.service.getAllEvent(1).pipe(
      tap(res => this.events.set(res)),
      take(1)
    )
  }
  createEvent(form: { name: string | null | undefined; description: string | null | undefined }) {
    this.service.createEvent(1, {
      name: form.name ?? '',
      description: form.description ?? ''
    }).pipe(
      tap(() => this.update())
    ).subscribe()
  }

  deleteEvent(idEvento: number) {
    this.service.deleteEvent(1, idEvento).pipe(
      tap(() => this.update())
    ).subscribe()
  }
}