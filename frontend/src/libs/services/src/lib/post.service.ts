import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import { IPostDraft, IPostModel } from '@synergia-frontend/interfaces';

/** Chamadas de /api/entity-post (feed do evento). */
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(BASE_PATH)}/api/entity-post`;

  public listOfEvent(idEvent: number) {
    return this.http.post<IPostModel[]>(`${this.url}/list-posts-of-event`, null, {
      params: { 'id-event': idEvent },
    });
  }
  public storeOnEvent(idEvent: number, idAccount: number, post: IPostDraft) {
    return this.http.post<number>(`${this.url}/store`, {
      idAccount,
      title: post.title,
      content: post.content,
      referenceId: idEvent,
      referenceEntity: 'EVENT',
    });
  }
  public update(idPost: number, idAccount: number, post: IPostDraft) {
    return this.http.post<void>(`${this.url}/update/${idPost}`, { idAccount, ...post });
  }
  public delete(idPost: number, idAccount: number) {
    return this.http.delete<void>(`${this.url}/delete/${idPost}`, {
      params: { 'id-account': idAccount },
    });
  }
}
