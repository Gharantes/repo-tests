import { MatDialog } from '@angular/material/dialog';
import { IPostDraft } from '@synergia-frontend/interfaces';
import { DialogAddPostComponent } from './dialog-add-post.component';

/** Abre o diálogo de postagem; com `editing`, já vem preenchido. Emite o resultado ou undefined se cancelar. */
export function openPostDialog(dialog: MatDialog, editing?: IPostDraft) {
  return dialog
    .open<DialogAddPostComponent, IPostDraft | null, IPostDraft>(DialogAddPostComponent, {
      width: '680px',
      maxWidth: '100%',
      height: '640px',
      maxHeight: '100%',
      data: editing ?? null,
    })
    .afterClosed();
}
