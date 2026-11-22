import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Avisa quem mostra listas de projetos/eventos (ex.: sidebar) que algo mudou
 * sem troca de rota — como salvar a edição na própria página de detalhes.
 */
@Injectable({
  providedIn: 'root',
})
export class EntityChangesService {
  private readonly projectsChanged = new Subject<void>();
  private readonly eventsChanged = new Subject<void>();

  public readonly projectsChanged$ = this.projectsChanged.asObservable();
  public readonly eventsChanged$ = this.eventsChanged.asObservable();

  public notifyProjectsChanged() {
    this.projectsChanged.next();
  }

  public notifyEventsChanged() {
    this.eventsChanged.next();
  }
}
