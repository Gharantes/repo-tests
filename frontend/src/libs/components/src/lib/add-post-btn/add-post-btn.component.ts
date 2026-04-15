import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ITagModel } from '@synergia-frontend/interfaces';
import { tap } from 'rxjs';
import { DialogAddPostComponent } from './dialog-add-post/dialog-add-post.component';

@Component({
  selector: 'lib-add-post-btn',
  standalone: true,
  templateUrl: './add-post-btn.component.html',
  styleUrl: './add-post-btn.component.scss',
  imports: [MatButtonModule, MatIconModule],
})
export class AddPostBtnComponent {
  @Output() savePostEvent = new EventEmitter<ITagModel>();

  constructor(
    private readonly dialog: MatDialog
  ) {}

  protected addPost() {
    this.dialog.open(DialogAddPostComponent, {
      width: '600px',
      maxWidth: '100%',
      height: '600px',
      maxHeight: '100%',
    }).afterClosed().pipe(
      tap((res: null|undefined|ITagModel) => {
        if (res != null) {
          this.savePostEvent.emit(res)
        }
      })
    ).subscribe();
  }
}