import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface IDialogJoinRequestData {
  projectTitle: string;
}

const MAX_LENGTH = 4000;

/**
 * Apresentação de quem pede para participar de um projeto. O texto vai como mensagem para o grupo
 * do projeto em Mensagens, onde os membros leem e aceitam ou recusam. Devolve o texto, ou nada se
 * a pessoa desistir.
 */
@Component({
  selector: 'lib-dialog-join-request',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <form class="container" (submit)="$event.preventDefault(); send()">
      <h2 class="heading">Participar de {{ data.projectTitle }}</h2>
      <p class="intro">
        Sua mensagem vai para o grupo do projeto em <b>Mensagens</b>. Os membros leem e decidem se você entra.
      </p>
      <ul class="tips">
        <li>No que você quer trabalhar no projeto</li>
        <li>O que você já sabe fazer (ferramentas, experiências, cursos)</li>
        <li>Quanto tempo você tem para se dedicar</li>
      </ul>
      <textarea
        rows="8"
        placeholder="Olá! Quero participar porque…"
        [maxLength]="maxLength"
        [value]="text()"
        (input)="text.set($any($event.target).value)"
        cdkFocusInitial
      ></textarea>
      <small class="count">{{ text().length }}/{{ maxLength }}</small>
      <div class="buttons">
        <button mat-button type="button" (click)="close()">Cancelar</button>
        <button mat-flat-button class="send-btn" type="submit" [disabled]="!text().trim()">
          <mat-icon>send</mat-icon> Enviar pedido
        </button>
      </div>
    </form>
  `,
  styles: `
    .container { display: flex; flex-direction: column; gap: 10px; padding: 18px; box-sizing: border-box; }
    .heading { margin: 0; font-size: 18px; font-weight: 700; color: #121840; }
    .intro { margin: 0; font-size: 13.5px; color: #55524b; }
    .tips { margin: 0; padding-left: 18px; font-size: 13px; color: #8a877f; }
    textarea { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #dcd9d1; border-radius: 8px;
      font: inherit; font-size: 14px; resize: vertical; outline: none; }
    textarea:focus { border-color: #3B52CC; }
    .count { align-self: flex-end; font-size: 11.5px; color: #9a978f; }
    .buttons { display: flex; justify-content: flex-end; gap: 8px; }
    .send-btn { --mat-button-filled-container-color: #3B52CC; --mat-button-filled-label-text-color: #fff; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DialogJoinRequestComponent {
  public readonly data = inject<IDialogJoinRequestData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<DialogJoinRequestComponent, string>>(MatDialogRef);
  public readonly text = signal('');
  public readonly maxLength = MAX_LENGTH;

  public static open(dialog: MatDialog, data: IDialogJoinRequestData) {
    return dialog
      .open<DialogJoinRequestComponent, IDialogJoinRequestData, string>(DialogJoinRequestComponent, {
        width: '520px',
        maxWidth: '100%',
        data,
      })
      .afterClosed();
  }

  public send() {
    const message = this.text().trim();
    if (message) this.dialogRef.close(message);
  }

  public close() {
    this.dialogRef.close();
  }
}
