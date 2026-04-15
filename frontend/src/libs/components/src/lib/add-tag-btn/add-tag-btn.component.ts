import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddTagComponent } from '../dialog-add-tag/dialog-add-tag.component';
import { ITagModel } from '@synergia-frontend/interfaces';
import { tap } from 'rxjs';

@Component({
  selector: 'lib-add-tag-btn',
  standalone: true,
  templateUrl: './add-tag-btn.component.html',
  styleUrl: './add-tag-btn.component.scss',
  imports: [MatButtonModule, MatIconModule],
})
export class AddTagBtnComponent {
  @Input() forProjects = false;
  @Input() forEvents = false;
  @Input() forAccounts = false;

  @Output() saveTagEvent = new EventEmitter<ITagModel>();

  constructor(
    private readonly dialog: MatDialog
  ) {}

  protected addTag() {
    this.dialog.open(DialogAddTagComponent, {
      data: {
        forProjects: this.forProjects,
        forEvents: this.forEvents,
        forAccounts: this.forAccounts,
      },
      width: '400px',
      maxWidth: '100%',
      height: '86px',
      maxHeight: '86px',
    }).afterClosed().pipe(
      tap((res: null|undefined|ITagModel) => {
        if (res != null) {
          this.saveTagEvent.emit(res)
        }
      })
    ).subscribe();
  }
}