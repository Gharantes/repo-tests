import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_PATH, EventDto } from '@synergia-frontend/api';

/** Em quais eventos um projeto está registrado (/api/action-manage-relationships). */
@Injectable({
  providedIn: 'root',
})
export class ProjectEventsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(BASE_PATH)}/api/action-manage-relationships`;

  public listEventsOfProject(idProject: number) {
    return this.http.post<EventDto[]>(`${this.url}/list-events-of-project`, null, {
      params: { 'id-project': idProject },
    });
  }
  public register(idProject: number, idEvent: number) {
    return this.http.post<void>(`${this.url}/create-relationship-event-and-project`, null, {
      params: { 'id-project': idProject, 'id-event': idEvent },
    });
  }
  public unregister(idProject: number, idEvent: number) {
    return this.http.post<void>(`${this.url}/remove-relationship-event-and-project`, null, {
      params: { 'id-project': idProject, 'id-event': idEvent },
    });
  }
}
