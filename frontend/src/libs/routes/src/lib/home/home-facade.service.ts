import { Injectable } from '@angular/core';
import { EventoResourceService } from '@synergia-frontend/api';
import { tap } from 'rxjs';

@Injectable()
export class HomeFacadeService {
  constructor(
    private readonly teste: EventoResourceService
  ) {
    this.teste.getAllEvento().pipe(
      tap(() => console.log("EXECUTED")),
      tap(res => console.log(res)),
    ).subscribe()
  }
}