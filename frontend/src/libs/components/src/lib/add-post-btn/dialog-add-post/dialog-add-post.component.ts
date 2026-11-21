import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { IPostDraft } from '@synergia-frontend/interfaces';
import { MarkdownComponent } from '../../markdown/markdown.component';

/** Escreve ou edita uma postagem. Recebe a postagem a editar (opcional) e devolve título e conteúdo. */
@Component({
  selector: 'lib-dialog-add-post',
  standalone: true,
  templateUrl: './dialog-add-post.component.html',
  styleUrl: './dialog-add-post.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MarkdownComponent,
  ],
})
export class DialogAddPostComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject<MatDialogRef<DialogAddPostComponent, IPostDraft>>(MatDialogRef);
  private readonly editing = inject<IPostDraft | null>(MAT_DIALOG_DATA, { optional: true });

  public readonly isEdit = this.editing != null;
  public readonly preview = signal(false);
  public readonly postTitleControl = this.fb.control(this.editing?.title ?? '');
  public readonly postContentControl = this.fb.control(this.editing?.content ?? '');
  public readonly content = toSignal(this.postContentControl.valueChanges, { initialValue: this.postContentControl.value });

  public isEmpty(): boolean {
    return !this.postTitleControl.value.trim() && !this.postContentControl.value.trim();
  }

  public close() {
    this.dialogRef.close();
  }

  public publishPost() {
    if (this.isEmpty()) return;
    this.dialogRef.close({
      title: this.postTitleControl.value.trim(),
      content: this.postContentControl.value,
    });
  }
}
