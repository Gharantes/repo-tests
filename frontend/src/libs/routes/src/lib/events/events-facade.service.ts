import { Injectable } from '@angular/core';
import { EventoResourceService } from '@synergia-frontend/api';
import { tap } from 'rxjs';

@Injectable()
export class EventsFacadeService {
  constructor(
    private readonly teste: EventoResourceService
  ) {
  }

  createGrouping(form: { name: string | null | undefined; description: string | null | undefined }) {
    // this.teste.createEvento({})
  }
}