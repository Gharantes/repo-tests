import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import { CalendarParent, ICalendarEntryDraft, ICalendarEntryModel } from '@synergia-frontend/interfaces';

/** Chamadas de /api/entity-calendar (aba Calendário de projetos e eventos). */
@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(BASE_PATH)}/api/entity-calendar`;

  /** No projeto, vêm também as datas dos eventos em que ele está registrado. */
  public list(parentEntity: CalendarParent, parentId: number) {
    return parentEntity === 'PROJECT'
      ? this.http.post<ICalendarEntryModel[]>(`${this.url}/list-entries-of-project`, null, { params: { 'id-project': parentId } })
      : this.http.post<ICalendarEntryModel[]>(`${this.url}/list-entries-of-event`, null, { params: { 'id-event': parentId } });
  }
  public store(parentEntity: CalendarParent, parentId: number, idAccount: number, entry: ICalendarEntryDraft) {
    return this.http.post<number>(`${this.url}/store`, { idAccount, ...entry }, {
      params: { 'parent-entity': parentEntity, 'parent-id': parentId },
    });
  }
  public update(idEntry: number, idAccount: number, entry: ICalendarEntryDraft) {
    return this.http.post<void>(`${this.url}/update/${idEntry}`, { idAccount, ...entry });
  }
  public delete(idEntry: number, idAccount: number) {
    return this.http.delete<void>(`${this.url}/delete/${idEntry}`, {
      params: { 'id-account': idAccount },
    });
  }
}
