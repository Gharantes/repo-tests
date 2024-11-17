import { Component } from '@angular/core';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { LocalStorageService, SnackbarService, TenantsService } from '@synergia-frontend/services';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TenantResourceService } from '@synergia-frontend/api';
import { isBlankOrNull, IsNumericOnly } from '@synergia-frontend/utils';
import { tap } from 'rxjs';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-register-tenant-dialog',
  standalone: true,
  template: `
    <mat-dialog-content>
      <form>
        <lib-sy-common-form-field
          [label]="'Id ou Identifier do Tenant'"
          [control]="control"
        ></lib-sy-common-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button (click)="salvar()">Salvar Tenant</button>
    </mat-dialog-actions>
  `,
  imports: [
    CommonFormFieldComponent,
    MatButton,
    MatDialogActions,
    MatDialogContent,
  ],
  providers: [],
  styles: [
    `
      form {
      }
    `,
  ],
})
export class RegisterTenantDialogComponent {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly localStorageService: LocalStorageService,
    public readonly tenantResourceService: TenantResourceService,
    private readonly snackbarService: SnackbarService,
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<RegisterTenantDialogComponent>
  ) {
    this.control = this.fb.control(null);
  }

  /** Create Login Form **/
  public control: FormControl<string | null>;

  salvar() {
    const value = this.control.value;

    let id: number | undefined;
    let identifier: string | undefined;

    if (isBlankOrNull(value)) {
      this.snackbarService.show('Input inválido.');
      return;
    }
    if (IsNumericOnly(value as string)) {
      id = Number(value);
    } else {
      identifier = value ?? undefined;
    }
    if (id == null && identifier == null) {
      this.snackbarService.show('Input inválido.');
      return;
    }

    this.tenantResourceService
      .getTenantByUniqueKeys(id, identifier)
      .pipe(
        tap((res) => {
          if (res == null) {
            console.log(null);
          } else {
            this.localStorageService.addTenantToLocalStorage(res);
            this.tenantsService.setTenantsFromLocalStorage();
            this.dialogRef.close(res);
          }
        })
      )
      .subscribe();
  }
}
