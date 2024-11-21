import { Component, DestroyRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendableTableComponent } from '@synergia-frontend/tables';
import { UsersFacadeService } from './users-facade.service';
import { MatButton } from '@angular/material/button';
import { CommonFileInputButtonComponent } from '@synergia-frontend/ui';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-users',
  standalone: true,
  imports: [
    CommonModule,
    ExtendableTableComponent,
    MatButton,
    CommonFileInputButtonComponent,
  ],
  template: `
    <common-file-input-button
      [label]="'Criar Usuários por Excel'"
      [isBtnDisabled]="false"
      [multiple]="false"
      (fileSelectedEvent)="holdFile($event)"
      [allowedFileTypes]="'.xls,.xlsx,.csv'"
    ></common-file-input-button>

    <button mat-raised-button (click)="uploadFile()">Upload</button>

    <lib-extendable-table
      [columns]="facade.tableInfo"
      [data$]="facade.usersData$"
    ></lib-extendable-table>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        padding: 15px;
        box-sizing: border-box;
        overflow: auto;
      }
    `,
  ],
  providers: [UsersFacadeService],
})
export class UsersRouteComponent {

  constructor(
    public readonly facade: UsersFacadeService,
    private readonly destroyRef: DestroyRef
  ) {
    this.facade.initializeNgUpdate(this.destroyRef);
    this.facade.update()
  }

  private file: File | undefined = undefined;
  holdFile($event: File) {
    this.file = $event;
  }

  uploadFile() {
    if (this.file) {
      this.facade.createAccountsInMassFromExcelFile(this.file, this.destroyRef);
    }
  }
}
