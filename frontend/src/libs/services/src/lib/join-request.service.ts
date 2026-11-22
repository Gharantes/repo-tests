import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import { INotificationModel } from '@synergia-frontend/interfaces';
import { Observable, of, tap } from 'rxjs';
import { EntityChangesService } from './entity-changes.service';
import { NotificationService } from './notification.service';
import { SessionService } from './session.service';
import { SnackbarService } from './snackbar.service';

/**
 * Pedido para participar de um projeto (/api/entity-join-request). Quem não é membro pede pelo card
 * do projeto em Explorar; os membros recebem um aviso REQUEST e qualquer um deles aceita ou recusa.
 */
@Injectable({
  providedIn: 'root',
})
export class JoinRequestService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly snackbar = inject(SnackbarService);
  private readonly notifications = inject(NotificationService);
  private readonly entityChanges = inject(EntityChangesService);
  private readonly url = `${inject(BASE_PATH)}/api/entity-join-request`;

  public hasPendingRequest(idProject: number): Observable<boolean> {
    const idAccount = this.session.getUserId();
    if (idAccount == null) return of(false);
    return this.http.post<boolean>(`${this.url}/has-pending-request`, null, {
      params: { 'id-project': idProject, 'id-account': idAccount },
    });
  }

  /** `message`: a apresentação (o que quer fazer, o que sabe fazer). Vai para o grupo do projeto. */
  public request(idProject: number, message: string): Observable<number> {
    const idAccount = this.session.getUserId();
    return this.http.post<number>(`${this.url}/request`, { message }, {
      params: { 'id-project': idProject, 'id-account': idAccount ?? -1 },
    });
  }

  /**
   * Responde pelo id do pedido (ex.: pela mensagem no grupo do projeto). O aviso do sino some junto,
   * por isso os avisos são relidos.
   */
  public respond(idRequest: number, action: 'accept' | 'decline'): Observable<void> {
    const idAccount = this.session.getUserId();
    return this.http
      .post<void>(`${this.url}/${action}/${idRequest}`, null, { params: { 'id-account': idAccount ?? -1 } })
      .pipe(
        tap(() => {
          if (action === 'accept') this.entityChanges.notifyProjectsChanged();
          this.notifications.load();
        })
      );
  }

  public cancel(idProject: number): Observable<void> {
    const idAccount = this.session.getUserId();
    return this.http.post<void>(`${this.url}/cancel`, null, {
      params: { 'id-project': idProject, 'id-account': idAccount ?? -1 },
    });
  }

  /** Aceita o pedido de um aviso REQUEST. O aviso some para todos os membros. */
  public accept(notification: INotificationModel) {
    this.answer(notification, 'accept');
  }

  public decline(notification: INotificationModel) {
    this.answer(notification, 'decline');
  }

  private answer(notification: INotificationModel, action: 'accept' | 'decline') {
    const idAccount = this.session.getUserId();
    if (idAccount == null || notification.type !== 'REQUEST') return;
    this.notifications.remove(notification);
    this.respond(notification.referenceId, action)
      .subscribe({
        next: () => {
          const verb = action === 'accept' ? 'agora participa de' : 'teve o pedido recusado em';
          this.snackbar.showMessage(`${notification.actorName} ${verb} ${notification.parentTitle}.`);
        },
        // Ex.: outro membro respondeu antes. A releitura mostra o estado certo.
        error: (err) => {
          this.snackbar.catchError(err, 'Não foi possível responder ao pedido.');
          this.notifications.load();
        },
      });
  }
}
