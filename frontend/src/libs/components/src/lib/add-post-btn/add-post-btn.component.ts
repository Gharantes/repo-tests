import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { IPostDraft } from '@synergia-frontend/interfaces';
import { openPostDialog } from './dialog-add-post/open-post-dialog';

@Component({
  selector: 'lib-add-post-btn',
  standalone: true,
  templateUrl: './add-post-btn.component.html',
  styleUrl: './add-post-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatIconModule],
})
export class AddPostBtnComponent {
  @Output() savePostEvent = new EventEmitter<IPostDraft>();

  constructor(
    private readonly dialog: MatDialog
  ) {}

  protected addPost() {
    openPostDialog(this.dialog).subscribe((res) => {
      if (res != null) {
        this.savePostEvent.emit(res);
      }
    });
  }
}
