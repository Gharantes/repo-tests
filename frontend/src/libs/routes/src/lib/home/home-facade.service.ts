import { Injectable, signal } from '@angular/core';
import { EventoDto, EventoResourceService } from '@synergia-frontend/api';
import { tap } from 'rxjs';

@Injectable()
export class HomeFacadeService {
  public readonly events = signal<EventoDto[]>([])

  constructor(
    private readonly service: EventoResourceService
  ) {
    this.service.getAllEvent(1).pipe(
      tap(res => this.events.set(res)),
    ).subscribe()
  }
}