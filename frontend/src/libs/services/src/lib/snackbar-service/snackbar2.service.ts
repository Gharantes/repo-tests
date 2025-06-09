import { ApplicationRef, ComponentRef, createComponent, DestroyRef, EnvironmentInjector, Injectable, signal } from '@angular/core';
import { catchError, interval, Observable, of, Subject, take, tap, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackbarStackComponent } from './snackbar-stack.component';
import { SnackbarMessageType } from './snackbar-message-type';
import { IDoSnackbarMessage } from './i-do-snackbar-message';
import { isBlankOrNull } from '@synergia-frontend/utils';

@Injectable({
  providedIn: 'root',
})
export class Snackbar2Service {
  private messageList = signal<IDoSnackbarMessage[]>([]);
  private readonly messageDuration = 3000; // 3 Seconds

  constructor(
    private environmentInjector: EnvironmentInjector,
    private readonly appRef: ApplicationRef,
  ) {}

  public initializeStackedSnackbarsComponent() {
    const component: ComponentRef<SnackbarStackComponent> = createComponent(SnackbarStackComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.appRef.attachView(component.hostView);
    document.body.appendChild(component.location.nativeElement);
  }


  public catchError(err: any, altMessage: string | undefined = undefined) {
    let message = null;

    if (!navigator.onLine) {
      message = 'Você está sem conexão com a internet. Verifique sua conexão e tente novamente.';
    }
    if (err.status === 400) {
      message = 'Requisição inválidada. Verfique os dados enviados e tente novamente.';
    }

    if (err.status === 401) {
      message = 'Sessão expirada ou não autenticada. Faça login novamente.';
    }

    if (err.status === 403) {
      message = 'Você não tem permissão para acessar este recurso.';
    }

    if (err.status === 404) {
      message = 'Recurso não encontrado.';
    }

    if (err.status === 408) {
      message = 'Tempo de requisição esgotado. Tente novamente.';
    }

    if (err.status === 413) {
      message = 'O arquivo enviado é muito grande. Por favor, envie um arquivo menor.';
    }

    if (err.status === 426) {
      message = 'Atualização necessária. Por favor, atualize seu aplicativo ou navegador para continuar.';
    }

    if (err.status === 502) {
      message = 'Erro de gateway inválido. Ocorreu um problema na comunicação com o servidor. Tente novamente.';
    }

    if (err.status === 503  ) {
      message = 'O serviço está temporariamente indisponível. Tente novamente mais tarde.';
    }

    if (err.status === 504) {
      message = 'O servidor demorou muito para responder. Verifique sua conexão e tente novamente.';
    }


    if (isBlankOrNull(message)) {
      message = err.headers.get('x-error');
    }
    if (isBlankOrNull(message)) {
      message = altMessage;
    }
    if (isBlankOrNull(message)) {
      return;
    }
    this.message(message, 'error');
  }



  public message(message: string, type: SnackbarMessageType = 'info') {
    const id = this.generateUniqueId();
    this.messageList.update(v => [
      ...v,
      {
        message: message,
        timed: true,
        id: id,
        type: type,
        closing: false,
      },
    ]);
    /** Remove Message After 3 Seconds **/
    interval(this.messageDuration)
      .pipe(
        tap(() => this.removeMessageById(id)),
        take(1),
      )
      .subscribe();
  }
  public addIdeterminateMessageToList(message: string, forceRemove: DestroyRef, type: SnackbarMessageType = 'info') {
    const id = this.generateUniqueId();

    this.messageList.update(v => [
      ...v,
      {
        message: message,
        timed: false,
        id: id,
        type: type,
        closing: false,
      },
    ]);

    /** Remove Message Only When Prompted to do so **/
    const remove = new Subject<void>();
    remove
      .pipe(
        tap(() => this.removeMessageById(id)),
        take(1),
      )
      .subscribe();

    forceRemove.onDestroy(() => {
      remove.next();
      remove.complete();
    });

    return remove;
  }

  public infiniteMessage(message: string, forceRemove: DestroyRef, type: SnackbarMessageType = 'info') {
    const subject = this.addIdeterminateMessageToList(message, forceRemove, type);

    return () => {
      subject.next();
      subject.complete();
    };
  }

  private removeMessageById(id: number) {
    this.messageList.update(messages => {
      return messages.map(msg => {
        if (msg.id === id) {
          return { ...msg, closing: true };
        }
        return msg;
      });
    });
    timer(500).subscribe(() => {
      this.messageList.update(messages => {
        return messages.filter(msg => msg.id != id);
      });
    });
  }

  private generateUniqueId(min = 1, max = 1000000): number {
    const existingIds = this.messageList().map(v => v.id);
    let newId;
    do {
      newId = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (existingIds.includes(newId));
    return newId;
  }
  public getMessageList() {
    return this.messageList();
  }
}