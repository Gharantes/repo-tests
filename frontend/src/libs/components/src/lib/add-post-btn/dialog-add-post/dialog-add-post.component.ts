import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '@synergia-frontend/services';
import { MatDialogRef } from '@angular/material/dialog';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'lib-dialog-add-post',
  standalone: true,
  templateUrl: './dialog-add-post.component.html',
  styleUrl: './dialog-add-post.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    CdkTextareaAutosize,
  ],
})
export class DialogAddPostComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  public readonly sessionService = inject(SessionService);
  public readonly dialogRef = inject(MatDialogRef<DialogAddPostComponent>);

  public readonly postTitleControl = this.fb.control<string | undefined>(
    undefined
  );
  public readonly postContentControl = this.fb.control<string | undefined>(
    undefined
  );

  public close() {
    this.dialogRef.close();
  }
  public publishPost() {
    this.dialogRef.close();
  }
}
