import { DestroyRef, effect, Injectable, signal } from '@angular/core';
import { interval, Subject, take, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDoMessage } from './i-do-message';
import { isBlankOrNull } from '@synergia-frontend/utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly messages = signal<IDoMessage[]>([]);

  constructor(private readonly snackbar: MatSnackBar) {
    effect(() => {
      const messages = this.messages();
      if (messages.length == 0) {
        this.dismiss();
        return;
      } else {
        this.showSnackbar();
      }
    });
  }

  private dismiss() {
    return this.snackbar.dismiss();
  }
  private showSnackbar() {
    this.dismiss();
    const concatenatedMessages = this.concatenateMessages();
    console.log(concatenatedMessages);
    this.snackbar.open(concatenatedMessages, undefined);
  }

  private concatenateMessages() {
    return this.messages().map(v => v.message).join('; ');
  }
  public temporaryMessage(message: string) {
    const id = this.createUniqueId();
    if (id == undefined) {
      return;
    }
    if (isBlankOrNull(message)) {
      return;
    }
    this.messages.update((v) => [...v, { id, message }]);
    interval(3000)
      .pipe(
        take(1),
        tap(() => this.removeMessageById(id))
      )
      .subscribe();
  }
  public persistentMessage(
    message: string,
    forceRemove: DestroyRef
  ): Subject<void> | undefined {
    const id = this.createUniqueId();
    if (id == undefined) {
      return;
    }
    if (isBlankOrNull(message)) {
      return;
    }
    this.messages.update((v) => [...v, { id, message }]);

    const remove = new Subject<void>();
    remove
      .pipe(
        tap(() => this.removeMessageById(id)),
        takeUntilDestroyed(forceRemove),
        take(1)
      )
      .subscribe();

    return remove;
  }

  private removeMessageById(id: number) {
    this.messages.update((messages) => {
      return messages.filter((message) => message.id !== id);
    });
  }

  private createUniqueId() {
    const existingIds = this.messages().map((v) => v.id);

    let id: number;
    if (existingIds.length == 1000) {
      console.error('More than 1000 simultaneous messages not allowed.');
      return;
    }
    do {
      id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    } while (existingIds.includes(id));

    return id;
  }
}