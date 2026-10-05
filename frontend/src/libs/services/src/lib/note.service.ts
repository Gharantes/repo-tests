import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import { INoteModel, IUpsertNote, NoteParent } from '@synergia-frontend/interfaces';

/** Chamadas de /api/entity-note (lousa). */
@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(BASE_PATH)}/api/entity-note`;

  public listByAccount(idAccount: number) {
    return this.http.post<INoteModel[]>(`${this.url}/list-notes-by-account`, null, {
      params: { 'id-account': idAccount },
    });
  }
  public listOfParent(parentEntity: NoteParent, parentId: number) {
    const name = parentEntity === 'PROJECT' ? 'project' : 'event';
    return this.http.post<INoteModel[]>(`${this.url}/list-notes-of-${name}`, null, {
      params: { [`id-${name}`]: parentId },
    });
  }
  public store(note: IUpsertNote) {
    return this.http.post<number>(`${this.url}/store`, note);
  }
  public update(idNote: number, note: IUpsertNote) {
    return this.http.post<void>(`${this.url}/update/${idNote}`, note);
  }
  /** Sem parent, desvincula. */
  public attach(idNote: number, idAccount: number, parent?: { entity: NoteParent; id: number }) {
    const params: Record<string, string | number> = { 'id-account': idAccount };
    if (parent) {
      params['parent-entity'] = parent.entity;
      params['parent-id'] = parent.id;
    }
    return this.http.post<void>(`${this.url}/attach/${idNote}`, null, { params });
  }
  public delete(idNote: number, idAccount: number) {
    return this.http.delete<void>(`${this.url}/delete/${idNote}`, {
      params: { 'id-account': idAccount },
    });
  }
}
