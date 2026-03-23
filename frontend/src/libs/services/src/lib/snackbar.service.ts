import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  signal,
} from '@angular/core';
import { interval, Subject, take, tap, timer } from 'rxjs';
import { SnackbarStackComponent } from './snackbar-service/snackbar-stack.component';
import { IDoSnackbarMessage } from './snackbar-service/i-do-snackbar-message';
import { isBlankOrNull } from '@synergia-frontend/utils';
import { IDoShowMessage } from './snackbar-service/i-do-show-message';
import { SnackbarMessageType } from './snackbar-service/snackbar-message-type';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private id = 1;

  public readonly messageList = signal<IDoSnackbarMessage[]>([]);
  private readonly messageDuration = 3000; // 3 Seconds

  constructor(
    private environmentInjector: EnvironmentInjector,
    private readonly appRef: ApplicationRef
  ) {}

  public initializeStackedSnackbarsComponent() {
    const component: ComponentRef<SnackbarStackComponent> = createComponent(
      SnackbarStackComponent,
      {
        environmentInjector: this.environmentInjector,
      }
    );
    this.appRef.attachView(component.hostView);
    document.body.appendChild(component.location.nativeElement);
  }

  public catchError(err: any, altMessage?: string) {
    const message = this.validateMessage(err, altMessage);
    if (message == null) { return; }
    this.addMessageToList({
      message: message,
      type: 'error',
      timed: true
    });
  }

  public showMessage(message: string, timed?: boolean, type?: SnackbarMessageType) {
    this.addMessageToList({
      message,
      timed,
      type
    })
  }
  private addMessageToList(ido: IDoShowMessage) {
    const message = ido.message;
    const timed = ido.timed ?? true;
    const type = ido.type ?? 'info';
    const id = this.getNewId();
    const el: IDoSnackbarMessage = {
      message,
      timed,
      id,
      type,
      closing: false,
    };
    this.messageList.update((v) => [...v, el]);

    const dismiss = this.setupDismissFunction(id);

    /** Remove Message After 3 Seconds **/
    if (timed) {
      this.scheduleRemoval(dismiss);
    }

    return { dismiss };
  }
  private scheduleRemoval(dismiss: () => void) {
    interval(this.messageDuration)
      .pipe(
        tap(() => dismiss()),
        take(1)
      )
      .subscribe();
  }
  private setupDismissFunction(id: number): () => void {
    const dismiss = new Subject<void>();
    dismiss
      .pipe(
        tap(() => this.removeMessageById(id)),
        take(1)
      )
      .subscribe();
    return () => {
      dismiss.next();
      dismiss.complete();
    };
  }

  private removeMessageById(id: number) {
    this.messageList.update((messages) => {
      return messages.map((msg) => {
        if (msg.id === id) {
          return { ...msg, closing: true };
        }
        return msg;
      });
    });
    timer(500).subscribe(() => {
      this.messageList.update((messages) => {
        return messages.filter((msg) => msg.id != id);
      });
    });
  }

  private getNewId(): number {
    this.id += 1;
    return this.id;
  }

  private validateMessage(
    err?: any,
    altMsg?: string
  ): string | null {
    let final = null;

    if (err != null) {
      final = err.headers.get('x-error');
    }
    if (isBlankOrNull(final)) {
      final = altMsg;
    }
    if (isBlankOrNull(final)) {
      return null
    }
    return final
  }
}